const express = require("express");
const router =  express.Router();
const authMiddleWare = require("../middlewares/middleware");
const newUser = require("../models/user");
const conversation = require("../models/convo");
const message = require("../models/message")


router.post("/convo",authMiddleWare,async(req,res)=>{


let reciverId = req.body.reciverId;
let userId = req.userId;

try{


let reciver = await newUser.findOne({_id:reciverId});

if(!reciver){
   return res.status(404).json({
        message:" person does'nt exist in db "
    })
    
}

 let existConvo = await conversation.findOne({
        
   participents: {
        $all: [userId, reciverId]
    }

    })

    console.log(existConvo);

    if(!existConvo){

        let newConvo = await conversation.create({ participents:[userId,reciverId]})
  return res.status(201).json(newConvo);


    }
             
    return res.status(200).json(existConvo);



}catch(e){

    res.status(400).json({
        message:"bad request"
    })



}


})


router.get("/convo/all",authMiddleWare,async(req,res)=>{

    let userId =  req.userId;



    try{

            let allConvo = await conversation.find({
                participents: userId
            }).populate("participents", "Username");


                const result = await Promise.all(
    allConvo.map(async (convo) => {
        const lastMessage = await message
            .findOne({ converasation_id: convo._id })
            .sort({ createdAt: -1});

        return {
            ...convo.toObject(),
            lastMessage: lastMessage
        };
    })
);

return res.status(200).json(result);
            
            

    }catch(err){

        res.status(501).json({
            message:"Bad request on db"
        })

    }

})





module.exports = router;