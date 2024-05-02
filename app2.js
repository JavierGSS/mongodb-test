// We initialize a collection object

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

const pipeline2 = [
  { $match: { amount: { $gte: 10 }, account_type: "Credit" } },
  {
    $sort: { amount: -1 },
  },
  {
    $project: {
      _id: 0,
      amount: 1,
      account_type: 1,
      mxn_amount: { $divide: ["$amount", 0.058] },
    },
  },
];

const main = async () => {
  try {
    // We establish a connection to MongoDB and run our aggregation pipeline
    await client.connect();
    console.log(`DB connection success. \nFull connection string: ${uri}`);
    let comments = client.db("test").collection("comments");
    let result = comments.aggregate(pipeline2);
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
