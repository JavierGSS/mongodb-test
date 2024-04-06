const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri.js");

console.log(uri);

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
  } catch (error) {
    console.log(`Error connecting to database ${error}`);
  } finally {
    await client.close();
  }
};

main();
