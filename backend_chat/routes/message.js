const express = require("express");
const router =  express.Router();
const authMiddleWare = require("../middlewares/middleware");
const newUser = require("../models/user");
const conversation = require("../models/convo");

const message = require("../models/message")



router.post("/message",authMiddleWare,async(req,res)=>{


    let content = req.body.content;

    let convoId = req.body.converasation_id;

    let sender_id = req.userId ;

    console.log("convoId:", convoId);
console.log("sender:", sender_id);

    try{

        let  existConvo = await conversation.findOne({_id:convoId,participents:sender_id})

        if(existConvo){

            let newMessage = await message.create({
                converasation_id:convoId,
                sender_id: sender_id ,
                content: content

            })

            return res.status(201).json(newMessage)


        }

        return res.status(401).json({message:"convo or sender does not exist "})



    }catch(er){

        res.status(400).json({
            message:"bad request"
        })

    }


})


router.get("/messages/:convoId",authMiddleWare,async(req,res)=>{

    let convoId = req.params.convoId;
    let userId = req.userId;
    
        try{


            let   existConvo = await conversation.findOne({_id:convoId,participants:userId})

            if(existConvo){

                let messages = await message.find({
                      converasation_id : convoId 
                }).sort({createdAt: 1})


                    return res.status(200).json(messages);




            }else{
                return res.status(403).json({
                    message : "unauthorized"
                })
            }

        }catch(e){

            res.status(500).json({
             message: "unexpexted err in  db"
            })

        }



})

module.exports = router;