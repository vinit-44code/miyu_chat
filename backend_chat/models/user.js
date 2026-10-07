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


    }



})
const newUser = mongoose.model("newUser",UserSchema);

module.exports = newUser;