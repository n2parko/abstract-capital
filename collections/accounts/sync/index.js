// sync function for Accounts

const plaid = require("plaid");
const PubSub = require("@google-cloud/pubsub");
const moment = require("moment");

const pubsub = new PubSub("abstract-capital");
const topic = pubsub.topic("accounts");
const publisher = topic.publisher();

const plaidClient = new plaid.Client({
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  env: process.env.PLAID_ENV,
});
const now = moment();
const accessTokens = process.env.ACCESS_TOKENS;

exports.syncAccounts = (event, context) => {
  accessTokens.forEach((item, i) => {
    plaidClient.getAccounts(item, (err, res) => {
      res.accounts.forEach(async function (a) {
        console.log(a);

        const account = {
          account_id: a.account_id,
          mask: a.mask,
          name: a.name,
          official_name: a.official_name,
          subtype: a.subtype,
          type: a.type,
          updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
        };

        const dataBuffer = Buffer.from(JSON.stringify(account));
        publisher.publish(dataBuffer);
        console.log(account);
      });
    });
  });
};
