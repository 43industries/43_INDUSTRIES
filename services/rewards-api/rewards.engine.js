const config = require('./rewards.config');
const xrplService = require('./xrpl.service');

const store = new Map();

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getUserStore(userId) {
  if (!store.has(userId)) {
    store.set(userId, { dailyRewards: {}, streaks: {} });
  }
  return store.get(userId);
}

function getTier(balance) {
  for (const [name, tier] of Object.entries(config.tiers)) {
    if (balance >= tier.min && balance <= tier.max) return { name, ...tier };
  }
  return { name: 'explorer', ...config.tiers.explorer };
}

function calculateReward(action, userId, balance, purchaseValue = null) {
  const rule = config.actions[action];
  if (!rule) throw new Error(`Unknown reward action: ${action}`);

  const tier = getTier(balance);
  let base = rule.amount;
  if (action === 'purchase' && purchaseValue) {
    base = Math.floor(purchaseValue * rule.cashbackRate);
  }

  let amount = Math.floor(base * tier.multiplier);
  if (action === 'daily_login') {
    const userStore = getUserStore(userId);
    const streak = userStore.streaks.daily_login || 0;
    for (const [days, bonus] of Object.entries(rule.streakBonus).sort((a, b) => b[0] - a[0])) {
      if (streak >= parseInt(days, 10)) {
        amount += bonus;
        break;
      }
    }
  }
  return { amount, tier: tier.name, multiplier: tier.multiplier };
}

function canIssueReward(userId, action, amount) {
  const rule = config.actions[action];
  const userStore = getUserStore(userId);
  const today = getTodayKey();

  if (!userStore.dailyRewards[today]) {
    userStore.dailyRewards[today] = { total: 0, actions: {} };
  }
  const daily = userStore.dailyRewards[today];

  if (daily.total + amount > config.maxDailyRewardPerUser) {
    return { allowed: false, reason: `Daily reward limit (${config.maxDailyRewardPerUser} 43) reached` };
  }
  if (rule.maxPerDay !== null) {
    const actionCount = daily.actions[action] || 0;
    if (actionCount >= rule.maxPerDay) {
      return { allowed: false, reason: `Max ${rule.maxPerDay}x per day for action: ${action}` };
    }
  }
  return { allowed: true };
}

function recordReward(userId, action, amount) {
  const userStore = getUserStore(userId);
  const today = getTodayKey();
  if (!userStore.dailyRewards[today]) {
    userStore.dailyRewards[today] = { total: 0, actions: {} };
  }
  const daily = userStore.dailyRewards[today];
  daily.total += amount;
  daily.actions[action] = (daily.actions[action] || 0) + 1;
  if (action === 'daily_login') {
    userStore.streaks.daily_login = (userStore.streaks.daily_login || 0) + 1;
  }
}

async function issueReward({ userId, walletAddress, action, purchaseValue = null, note = '' }) {
  if (!config.actions[action]) return { success: false, error: `Unknown action: ${action}` };

  let balance = 0;
  try {
    balance = await xrplService.getBalance(walletAddress);
  } catch (_) {
    balance = 0;
  }

  const { amount, tier, multiplier } = calculateReward(action, userId, balance, purchaseValue);
  if (amount < config.minSendAmount) {
    return { success: false, error: `Calculated amount (${amount}) below minimum send (${config.minSendAmount})` };
  }

  const check = canIssueReward(userId, action, amount);
  if (!check.allowed) return { success: false, error: check.reason, limitReached: true };

  const memo = note || `${action} reward - 43_industries`;
  let txResult;
  try {
    txResult = await xrplService.send43(walletAddress, amount, memo);
  } catch (e) {
    return { success: false, error: e.message };
  }

  if (!txResult.success) {
    return { success: false, error: `Transaction failed: ${txResult.transactionResult}` };
  }

  recordReward(userId, action, amount);
  return {
    success: true,
    userId,
    walletAddress,
    action,
    amount,
    tier,
    multiplier,
    txHash: txResult.txHash,
    ledgerIndex: txResult.ledgerIndex,
    memo,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { issueReward, getTier, calculateReward };
