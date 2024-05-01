// We establish a connection to Mongo DB and initialize a collection object

const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri.js");
const client = new MongoClient(uri);
console.log("URI: ", uri);

const pipeline = [
  // Stage 1: Match the accounts w/h balance > 100
  { $match: { amount: { $gt: 100 } } },
  // Stage 2: Group and calculate average balance and total balance
  {
    $group: {
      _id: "$account_type",
      total_balance: { $sum: "$amount" },
      avg_balance: { $avg: "$amount" },
    },
  },
];

const main = async () => {
  try {
    await client.connect();
    console.log(`DB connection success. \nFull connection string: ${uri}`);
    let comments = client.db("test").collection("comments");
    let result = comments.aggregate(pipeline);
    for await (let doc of result) {
      console.log(doc);
    }
  } catch (error) {
    console.log("DB Error: ", error);
  } finally {
    await client.close();
  }
};

main();
