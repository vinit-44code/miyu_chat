const express = require("express");
const router =  express.Router();
const authMiddleWare = require("../middlewares/middleware");
const newUser = require("../models/user");
const conversation = require("../models/convo");


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
        
    participants: {
        $all: [userId, reciverId]
    }

    })

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


module.exports = router;