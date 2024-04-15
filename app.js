const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri.js");

console.log("URI: ", uri);

const client = new MongoClient(uri);
const dbname = "Cluster0";

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to ${dbname} database`);
  } catch (error) {
    console.log(`Error connecting to database ${dbname}`);
  }
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
