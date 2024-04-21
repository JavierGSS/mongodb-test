const { MongoClient, ObjectId } = require("mongodb");
const uri = require("./atlas_uri.js");

console.log("URI: ", uri);

const client = new MongoClient(uri);
const dbname = "test";
const collection_name = "posts";
const comm_collection = "comments";
const accountsCollection = client.db(dbname).collection(collection_name);
const commCollection = client.db(dbname).collection(comm_collection);

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

// Several constants are defined to perform the several operations, infra:
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
    account_id: "MDB959878982",
    account_holder: "Patricia Socco",
    account_type: "checking",
    balance: 837456.43,
    transfers_complete: ["TR650433"],
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

const documentsToFind = { balance: { $gt: 5000 } };
const documentToFind = { _id: new ObjectId("661d8d0e7ac126474a43a25e") };

const docsToUpdate = { account_type: "credit" };
const updates = { $push: { transfers_complete: "TR6780633" } };

const docToUpdate = { _id: new ObjectId("661d7db1489b490512643cb3") };
const update = { $inc: { balance: 1500 } };

const deleteMany = { account_holder: { $eq: "Patricia Socco" } };

// const main = async () => {
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
/*   try {
    await connectToDatabase();
    // let result = await accountsCollection.insertOne(sampleAccount);
    // let results = await accountsCollection.insertMany(sampleAccounts);
    let resultados = accountsCollection.find(documentsToFind);
    let resultado = accountsCollection.findOne(documentToFind);
    // console.log(`Inserted doc: ${result.insertedId}`);
    // console.log(`Inserted ${results.insertedCount} docs`);
    // console.log(results);
    let docCount = accountsCollection.countDocuments(documentsToFind);
    for await (const doc of resultados) {
      console.log("Resultados: ", doc);
    }
    // await resultados.forEach((doc) => console.log(doc)); (analogous to the former command but deprecated)
    console.log(`${await docCount} documents match the query.`);
    console.log("Resultado: found one doc: ", resultado);
  } catch (error) {
    console.log(`Error connecting to database ${error}`);
  } finally {
    await client.close();
  } */

/*   try {
    await connectToDatabase();
    let newData = await accountsCollection.updateOne(docToUpdate, update);
    newData.modifiedCount === 1
      ? console.log("Updated one doc: ", newData.modifiedCount)
      : console.log("No docs updated");
    let newInfo = await accountsCollection.updateMany(docsToUpdate, updates);
    newInfo.modifiedCount > 0
      ? console.log(`Updated ${newInfo.modifiedCount} docs.`)
      : console.log("No docs updated");
    let deleted = await accountsCollection.deleteOne({
      _id: new ObjectId("661d8d0e7ac126474a43a25e"),
    });
    deleted.deletedCount === 1
      ? console.log(`Deleted ${deleted.deletedCount} docs.`)
      : console.log("No docs deleted.");
    let deletedMany = await accountsCollection.deleteMany(deleteMany);
    deletedMany.deletedCount > 0
      ? console.log(`DeletedMany ${deleted.deletedCount} docs.`)
      : console.log("No docs deleted.");
  } catch (error) {
    console.error(`Error updating doc: ${error}`);
  } finally {
    await client.close();
  } */
// };

let account_id_sender = "MDB956478532"; // Pepito's account
let account_id_receiver = "MDB956478982"; // Sharon's account
let transaction_amount = 40;

const session = client.startSession(); // Start the client session

const main = async () => {
  console.log("Committing transactions...");
  try {
    // We define a sequence of operations to be performed inside a single transaction:

    const transactionResults = await session.withTransaction(async () => {
      // Step 1: Update the sender's balance
      const updateSenderResults = await accountsCollection.updateOne(
        { account_id: account_id_sender },
        { $inc: { balance: -transaction_amount } },
        { session }
      );
      console.log(
        `${updateSenderResults.matchedCount} docs matched the filter`
      );

      // Step 1: Update the receiver's balance
      const updateReceiverResults = await accountsCollection.updateOne(
        { account_id: account_id_receiver },
        { $inc: { balance: transaction_amount } },
        { session }
      );
      console.log(
        `${updateReceiverResults.matchedCount} docs matched the filter`
      );

      // Step 3: Define & push to comments collection a new tranfer-document:
      const transfer = {
        transfer_id: "TR9283096",
        amount: transaction_amount,
        from_account: account_id_sender,
        to_account: account_id_receiver,
      };

      const insertTransferResults = await commCollection.insertOne(transfer, {
        session,
      });
      console.log(
        `Successfully inserted ${insertTransferResults.insertedId} into comments collection`
      );

      // Step 4: Update transfers_complete field in sender & receiver:
      const updateSenderTransferResults = await accountsCollection.updateOne(
        { account_id: account_id_sender },
        { $push: { transfers_complete: transfer.transfer_id } },
        { session }
      );
      const updateReceiverTransferResults = await accountsCollection.updateOne(
        { account_id: account_id_receiver },
        { $push: { transfers_complete: transfer.transfer_id } },
        { session }
      );
      console.log(
        `${updateSenderTransferResults.modifiedCount} docs updated in sender; ${updateReceiverTransferResults.modifiedCount} docs modified in receiver`
      );
    });
  } catch (error) {
    console.log(`Transaction aborted: ${error}`);
    process.exit(1);
  } finally {
    await session.endSession();
    await client.close();
  }
};

main();
