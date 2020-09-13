// load function for Transactions

const { BigQuery } = require("@google-cloud/bigquery");
const datasetId = "{{YOUR_DATASET_ID}}"; // bigquery dataset ID
const tableId = "transactions";
const bigqueryClient = new BigQuery();

exports.loadTransactions = async (event, context) => {
  const pubsubMessage = event.data;
  console.log("pubsubmessage is" + pubsubMessage);
  const transaction = JSON.parse(
    Buffer.from(pubsubMessage, "base64").toString()
  );

  // Insert data into a table
  await bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert([transaction])
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
  console.log("Inserted " + transaction);
};
