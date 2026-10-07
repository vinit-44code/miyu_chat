const express = require("express");
const router =  express.Router();
const authMiddleWare = require("../middlewares/middleware");
const newUser = require("../models/user");

router.get("/test", (req, res) => {
    res.send("users router works");
});


router.get("/search",authMiddleWare,async(req,res)=>{

        let q = req.query.q;
        


        try{

            let resultSearch = await newUser.find({
                Username: {
              $regex: q
                      }
            }).select("-Password")

           
                      
                return res.status(200).json(resultSearch);
 



        }catch(err){

            res.status(500).json({
                message: "unexpacted err"
            })

        }



})

module.exports = router;