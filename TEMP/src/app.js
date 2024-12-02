// Import the MongoDB package
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb://localhost:27017";  // For local MongoDB, or replace with MongoDB Atlas URI
const dbName = "library";  // Database name
const collectionName = "users";  // Collection name

// Create a MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        console.log("Connected to MongoDB");

        // Select the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // 1. Insert a new document (User)
        const newUser = { username: "john_doe", email: "john@example.com", age: 25 };
        const insertResult = await collection.insertOne(newUser);
        console.log("New user inserted:", insertResult.insertedId);

        // 2. Find a user by username
        const foundUser = await collection.findOne({ username: "john_doe" });
        console.log("Found user:", foundUser);

        // 3. Update user age
        const updateResult = await collection.updateOne(
            { username: "john_doe" },
            { $set: { age: 26 } }
        );
        console.log("Updated user:", updateResult.modifiedCount);

        // 4. Delete user
        const deleteResult = await collection.deleteOne({ username: "john_doe" });
        console.log("Deleted user:", deleteResult.deletedCount);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Close the connection
        await client.close();
    }
}

main().catch(console.error);
