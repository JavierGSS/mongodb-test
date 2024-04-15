const { MongoClient, ObjectId } = require("mongodb");
const uri = require("./atlas_uri.js");

console.log("URI: ", uri);

const client = new MongoClient(uri);
const dbname = "Cluster0";

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
  account_id: "MDB956478532",
  account_holder: "Pepito Pérez",
  account_type: "checking",
  balance: 18927.43,
  transfers_complete: ["TR657689", "TR657689"],
  last_updated: new Date(),
};

const main = async () => {
  try {
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
  }
};

main();
