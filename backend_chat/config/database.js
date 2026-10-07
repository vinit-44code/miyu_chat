const mongoose = require("mongoose");

async function connectDb(params) {
    

    try{  

        await mongoose.connect("mongodb://127.0.0.1:27017/You_me");
        console.log("db is connected");


    }
    catch(err){

        console.log("Something went wrong");
        console.log(err);

    }


}

module.exports = connectDb;