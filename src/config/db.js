const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("server is connected to DB");

        const usersCollection = mongoose.connection.db.collection("users");
        const indexes = await usersCollection.indexes();
        const staleUsernameIndex = indexes.find((index) => index.name === "username_1");

        if (staleUsernameIndex) {
            await usersCollection.dropIndex("username_1");
            console.log("Dropped stale username_1 index from users collection");
        }
    } catch (err) {
        console.log("Error connecting to DB");
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB