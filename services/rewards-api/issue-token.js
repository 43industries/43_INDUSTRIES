require('dotenv').config();
const xrpl = require('xrpl');

const IS_MAINNET = process.argv.includes('--mainnet');
const NODE = IS_MAINNET ? 'wss://xrplcluster.com' : 'wss://s.altnet.rippletest.net:51233';
const CURRENCY = '43 ';
const TOTAL_SUPPLY = '100000000';

async function main() {
  const client = new xrpl.Client(NODE);
  await client.connect();

  let issuer;
  let distributor;
  if (!process.env.DISTRIBUTOR_ADDRESS) {
    if (IS_MAINNET) {
      issuer = xrpl.Wallet.generate();
      distributor = xrpl.Wallet.generate();
      console.log(`ISSUER_ADDRESS=${issuer.address}`);
      console.log(`ISSUER_SECRET=${issuer.seed}`);
      console.log(`DISTRIBUTOR_ADDRESS=${distributor.address}`);
      console.log(`DISTRIBUTOR_SECRET=${distributor.seed}`);
      throw new Error('Fund generated wallets on mainnet, then rerun with .env secrets.');
    }
    const funded1 = await client.fundWallet();
    const funded2 = await client.fundWallet();
    issuer = funded1.wallet;
    distributor = funded2.wallet;
    console.log(`ISSUER_ADDRESS=${issuer.address}`);
    console.log(`ISSUER_SECRET=${issuer.seed}`);
    console.log(`DISTRIBUTOR_ADDRESS=${distributor.address}`);
    console.log(`DISTRIBUTOR_SECRET=${distributor.seed}`);
  } else {
    issuer = xrpl.Wallet.fromSeed(process.env.ISSUER_SECRET);
    distributor = xrpl.Wallet.fromSeed(process.env.DISTRIBUTOR_SECRET);
  }

  await client.submitAndWait(
    {
      TransactionType: 'AccountSet',
      Account: issuer.address,
      SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
    },
    { wallet: issuer },
  );

  await client.submitAndWait(
    {
      TransactionType: 'TrustSet',
      Account: distributor.address,
      LimitAmount: { currency: CURRENCY, issuer: issuer.address, value: TOTAL_SUPPLY },
    },
    { wallet: distributor },
  );

  await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: issuer.address,
      Destination: distributor.address,
      Amount: { currency: CURRENCY, issuer: issuer.address, value: TOTAL_SUPPLY },
    },
    { wallet: issuer },
  );

  await client.disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
