const mongoose = require("mongoose");

const newConvo = new mongoose.Schema({



    participents :{
        type:[{
        
                  type : mongoose.Schema.Types.ObjectId,
                  ref : "newUser",
                  required : true
        
                
        
            }]
    },

})


const conversations = mongoose.model("conversations",newConvo);
module.exports = conversations