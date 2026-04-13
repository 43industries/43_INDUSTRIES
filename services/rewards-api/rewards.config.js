module.exports = {
  actions: {
    referral: { amount: 50, description: 'Referred a new verified society member', maxPerDay: 10 },
    daily_login: {
      amount: 2,
      description: 'Daily login reward',
      maxPerDay: 1,
      streakBonus: { 7: 5, 30: 20, 90: 50 },
    },
    content_creation: { amount: 25, description: 'Created approved society content', maxPerDay: 5 },
    event_attendance: { amount: 25, description: 'Attended a society event', maxPerDay: 3 },
    bug_report: { amount: 200, description: 'Submitted a valid bug report', maxPerDay: 2 },
    purchase: {
      amount: null,
      cashbackRate: 0.05,
      description: 'Cashback reward for society purchase',
      maxPerDay: null,
    },
    welcome_bonus: { amount: 100, description: 'Welcome bonus for new members', maxPerDay: 1 },
    governance_vote: { amount: 10, description: 'Participated in governance vote', maxPerDay: 1 },
  },
  tiers: {
    explorer: { min: 0, max: 999, multiplier: 1.0 },
    builder: { min: 1000, max: 9999, multiplier: 1.5 },
    founder: { min: 10000, max: 49999, multiplier: 2.0 },
    architect: { min: 50000, max: Infinity, multiplier: 3.0 },
  },
  maxDailyRewardPerUser: 500,
  minSendAmount: 1,
};
