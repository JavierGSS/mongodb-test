// We establish a connection to Mongo DB and initialize a collection object

const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri.js");
console.log("URI: ", uri);
const client = new MongoClient(uri);

const dbname = "test";
const collection_name = "posts";
const comm_collection = "comments";
const accountsCollection = client.db(dbname).collection(collection_name);
const commCollection = client.db(dbname).collection(comm_collection);

const pipeline = [
  // Stage 1: Match the accounts w/h balance > 100
  { $match: { balance: { $gt: 100 } } },
  // Stage 2: Group and calculate average balance and total balance
  {
    $group: {
      _id: "account_type",
      total_balance: { $sum: "$balance" },
      avg_balance: { $avg: "$balance" },
    },
  },
];
