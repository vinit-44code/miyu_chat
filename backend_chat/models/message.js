const mongoose = require("mongoose");

const Message = new mongoose.Schema({

    converasation_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "conversations",
        required : true
    },

    sender_id :{

          type : mongoose.Schema.Types.ObjectId,
          ref : "newUser",
          required : true

        

    },

    content:{
        type:String,
        required : true 
    }

},
{
    timestamps:true
}


)



const newMessage = mongoose.model("message",Message);
module.exports = newMessage ; 