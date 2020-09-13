// load function for Accounts

const { BigQuery } = require("@google-cloud/bigquery");
const datasetId = "{{DATA_SET_ID}}";
const tableId = "accounts";
const bigqueryClient = new BigQuery();

exports.loadAccounts = async (event, context) => {
  const pubsubMessage = event.data;
  const account = JSON.parse(Buffer.from(pubsubMessage, "base64").toString());

  // Insert data into a table
  await bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert([account])
    .catch((err) => {
      if (err && err.name === "PartialFailureError") {
        if (err.errors && err.errors.length > 0) {
          console.log("Insert errors:");
          err.errors.forEach((err) => console.error(err));
        }
      } else {
        console.error("ERROR:", err);
      }
    });
  console.log("Inserted " + account);
};
