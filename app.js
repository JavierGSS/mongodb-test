const { MongoClient, ObjectId } = require("mongodb");
const uri = require("./atlas_uri.js");

console.log("URI: ", uri);

const client = new MongoClient(uri);
const dbname = "test";
const collection_name = "posts";
const accountsCollection = client.db(dbname).collection(collection_name);

const connectToDatabase = async () => {
  /*   const account = {
    _id: new ObjectId(),
    account_id: "MDB956478532",
    account_holder: "Pepito Pérez",
    balance: 18927.43,
    transfers_complete: ["TR657689", "TR657689"],
    address: {
      city: "San Diego",
      zip: 13245,
      street: "MAIN ST",
      number: 369,
    },
  }; */

  try {
    await client.connect();
    console.log(`Connected to ${dbname} database`);
  } catch (error) {
    console.log(`Error connecting to database ${dbname}`);
  }
};

const sampleAccount = {
  account_id: "MDB956478982",
  account_holder: "Sharon King",
  account_type: "checking",
  balance: 1997.43,
  transfers_complete: ["TR657633"],
  last_updated: new Date(),
};

const sampleAccounts = [
  {
    account_id: "MDB956478982",
    account_holder: "Sharon King",
    account_type: "checking",
    balance: 1997.43,
    transfers_complete: ["TR657633"],
    last_updated: new Date(),
  },
  {
    account_id: "MDB431478982",
    account_holder: "Louise Smith",
    account_type: "checking",
    balance: 278297.43,
    transfers_complete: ["TR658633", "TR759403"],
    last_updated: new Date(),
  },
];

const main = async () => {
  /*   try {
    await connectToDatabase();
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
    let db = client.db("blog");
    await db
      .collection("posts")
      .insertOne({
        "first name": "Teresa",
        "last name": "Verthein",
        age: 50,
        title: "Impressions",
      })
      .then(console.log("Post in DB"));
    db.collection("posts").find({ age: { $eq: 46 } });
  } catch (error) {
    console.log(`Error connecting to database ${error}`);
  } finally {
    await client.close();
  } */

  try {
    await connectToDatabase();
    let result = await accountsCollection.insertOne(sampleAccount);
    console.log(`Inserted doc: ${result.insertedId}`);
  } catch (error) {
    console.log(`Error connecting to database ${error}`);
  } finally {
    await client.close();
  }
};

main();
