const mongoose = require("mongoose");

function connectDB(){
    
    mongoose.connect(process.env.connect)
    .then(() => {
        console.log("server is connected to DB");
    })
    .catch((err=> {
        console.log("Error connecting to DB")
        process.exit(1);
    }))

}

module.exports = connectToDB