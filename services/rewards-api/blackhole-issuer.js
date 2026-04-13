require('dotenv').config();
const xrpl = require('xrpl');

async function main() {
  const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  await new Promise((resolve) => {
    readline.question('Type CONFIRM to blackhole issuer: ', (answer) => {
      readline.close();
      if (answer !== 'CONFIRM') process.exit(0);
      resolve();
    });
  });

  const client = new xrpl.Client(process.env.XRPL_NODE);
  await client.connect();
  const issuer = xrpl.Wallet.fromSeed(process.env.ISSUER_SECRET);
  await client.submitAndWait(
    {
      TransactionType: 'AccountSet',
      Account: issuer.address,
      SetFlag: xrpl.AccountSetAsfFlags.asfDisableMaster,
    },
    { wallet: issuer },
  );
  await client.disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
