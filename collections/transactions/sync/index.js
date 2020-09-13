// sync function for Transactions

const plaid = require("plaid");
const moment = require("moment");
const PubSub = require("@google-cloud/pubsub");

const pubsub = new PubSub("abstract-capital");
const topic = pubsub.topic("transactions");

exports.syncTransactions = (event, context) => {
  const publisher = topic.publisher();

  const plaidClient = new plaid.Client({
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    env: process.env.PLAID_ENV,
  });

  const now = moment();
  const today = now.format("YYYY-MM-DD");
  const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

  const accessTokens = process.env.ACCESS_TOKENS;

  accessTokens.forEach(async (item, i) => {
    plaidClient.getTransactions(item, thirtyDaysAgo, today, (err, res) => {
      res.transactions.forEach(async function (e) {
        const transaction = {
          account_id: e.account_id,
          account_owner: e.account_owner,
          amount: e.amount,
          transaction_id: e.transaction_id,
          date: e.date,
          merchant_name: e.merchant_name,
          name: e.name,
          category: JSON.stringify(e.category),
          updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
          pending: e.pending,
        };
        const dataBuffer = Buffer.from(JSON.stringify(transaction));
        publisher.publish(dataBuffer);
      });
    });
  });
};
