const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

Username : {
      type:String,
         required: true,
        unique: true
},
Bio:{

    type :String,
    required :false,
    unique: false

}
 ,
    Email:{
             type: String,
        required: true,
        unique: true
    },
    Password:{
                type: String,
        required: true


    },

    Status: {
    type: String,
    enum: ["online", "away", "offline"],
    default: "offline"
}



})
const newUser = mongoose.model("newUser",UserSchema);

module.exports = newUser;