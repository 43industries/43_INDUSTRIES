const xrpl = require('xrpl');
require('dotenv').config();

let client = null;

async function getClient() {
  if (!client || !client.isConnected()) {
    client = new xrpl.Client(process.env.XRPL_NODE);
    await client.connect();
  }
  return client;
}

async function checkTrustLine(address) {
  const cl = await getClient();
  try {
    const resp = await cl.request({
      command: 'account_lines',
      account: address,
      peer: process.env.ISSUER_ADDRESS,
    });
    const lines = resp.result.lines || [];
    return lines.some((l) => l.currency === process.env.CURRENCY_CODE.trim());
  } catch (e) {
    if (e.message.includes('actNotFound')) return false;
    throw e;
  }
}

async function getBalance(address) {
  const cl = await getClient();
  try {
    const resp = await cl.request({
      command: 'account_lines',
      account: address,
      peer: process.env.ISSUER_ADDRESS,
    });
    const lines = resp.result.lines || [];
    const line = lines.find((l) => l.currency === process.env.CURRENCY_CODE.trim());
    return line ? Math.abs(parseFloat(line.balance)) : 0;
  } catch (e) {
    if (e.message.includes('actNotFound')) return 0;
    throw e;
  }
}

async function send43(destinationAddress, amount, memo = '') {
  const cl = await getClient();
  const wallet = xrpl.Wallet.fromSeed(process.env.DISTRIBUTOR_SECRET);
  const hasTrust = await checkTrustLine(destinationAddress);
  if (!hasTrust) throw new Error(`TRUST_LINE_MISSING: ${destinationAddress}`);

  const payment = {
    TransactionType: 'Payment',
    Account: process.env.DISTRIBUTOR_ADDRESS,
    Destination: destinationAddress,
    Amount: {
      currency: process.env.CURRENCY_CODE,
      issuer: process.env.ISSUER_ADDRESS,
      value: String(amount),
    },
  };

  if (memo) {
    payment.Memos = [
      {
        Memo: {
          MemoData: Buffer.from(memo, 'utf8').toString('hex').toUpperCase(),
          MemoType: Buffer.from('43_industries/reward', 'utf8').toString('hex').toUpperCase(),
        },
      },
    ];
  }

  const result = await cl.submitAndWait(payment, { wallet });
  const meta = result.result.meta;
  return {
    success: meta.TransactionResult === 'tesSUCCESS',
    txHash: result.result.hash,
    ledgerIndex: result.result.ledger_index,
    transactionResult: meta.TransactionResult,
  };
}

module.exports = { send43, checkTrustLine, getBalance };
