require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rewardsEngine = require('./rewards.engine');
const xrplService = require('./xrpl.service');
const rewardsConfig = require('./rewards.config');

const app = express();
app.use(cors());
app.use(express.json());

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
  }
  next();
}

app.get('/', (req, res) => {
  res.json({
    name: '43_industries Rewards API',
    version: '1.0.0',
    status: 'online',
    network: process.env.XRPL_NODE,
    currency: process.env.CURRENCY_CODE,
    timestamp: new Date().toISOString(),
  });
});

app.post('/reward', requireApiKey, async (req, res) => {
  const { userId, walletAddress, action, purchaseValue, note } = req.body;
  if (!userId || !walletAddress || !action) {
    return res.status(400).json({ error: 'Missing required fields: userId, walletAddress, action' });
  }

  const validActions = Object.keys(rewardsConfig.actions);
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: `Invalid action. Valid actions: ${validActions.join(', ')}` });
  }

  if (action === 'purchase' && !purchaseValue) {
    return res.status(400).json({ error: 'purchaseValue required for purchase action' });
  }

  try {
    const result = await rewardsEngine.issueReward({ userId, walletAddress, action, purchaseValue, note });
    const status = result.success ? 200 : result.limitReached ? 429 : 500;
    res.status(status).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/actions', (req, res) => {
  const actions = Object.entries(rewardsConfig.actions).map(([key, val]) => ({
    action: key,
    baseAmount: val.amount,
    cashbackRate: val.cashbackRate || null,
    description: val.description,
    maxPerDay: val.maxPerDay,
  }));
  res.json({ actions, tiers: rewardsConfig.tiers, maxDailyRewardPerUser: rewardsConfig.maxDailyRewardPerUser });
});

app.get('/wallet/:address/trustline', async (req, res) => {
  try {
    const hasTrust = await xrplService.checkTrustLine(req.params.address);
    res.json({ address: req.params.address, hasTrustLine: hasTrust });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.REWARDS_API_PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`43_industries Rewards API running on port ${PORT}`);
});

module.exports = app;
