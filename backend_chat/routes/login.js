const express = require("express");
const router =  express.Router();
const authMiddleWare = require("../middlewares/middleware");
const newUser = require("../models/user");
const byscrpt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator");


router.post("/regi",async(req,res)=>{


    let Newdata = req.body;

    if(Newdata.Username && Newdata.Email
     &&  
            validator.isEmail(Newdata.Email)
           && Newdata.Password && 
            Newdata.Password.length >= 8
    ){
        try{

            let hasedPass = await byscrpt.hash(Newdata.Password,12);

            let NewdataHash = {
                Username : Newdata.Username,
                Email : Newdata.Email,
                Password : hasedPass,
              Bio : Newdata.Bio
            }


            const newINFO = await newUser.create(NewdataHash);

             const jwtToken = jwt.sign(
                { userId: newINFO._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" });


                res.cookie("jwtToken", jwtToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000
});

return res.status(201).json({
    message: "account created"
});


        }catch(e){

            res.status(500).json({
                message:"internal server err"
            })

        }
    }else{
        res.status(400).json({
            message:"request failed "
        })
    }


})

router.post("/login",async(req,res)=>{

let loginInfo = req.body;

  if(validator.isEmail(loginInfo.Email)&&
            loginInfo.Password){


                try{

                       let AccExist = await newUser.findOne({Email:loginInfo.Email});


             if(AccExist){

                        
                    const passVaild = await byscrpt.compare(loginInfo.Password,AccExist.Password);

                    if(passVaild){
                         const jwtToken = jwt.sign({userId : AccExist.id},process.env.JWT_SECRET,{expiresIn: "1h"});
                           res.cookie("jwtToken",jwtToken,{

                                                        httpOnly : true,
                                                        secure :false,
                                                        sameSite : "lax",
                                                        maxAge : 60*60*1000
                                                    });

                                                    return res.status(200).json({
                                                        message:"login success"
                                                    })

                    }else{
                         return res.status(401).json({

                                        message: "invalid email or password"
                                    });
                    }

                       }else{
                         return res.status(401).json({

                                        message: "invalid email or password"
                                    });
                       }

                }catch(e){

                    
                                console.log("acc does'nt exist ")

                                res.status(500).json({

                                        message: "unexpacted err in database "
                                    });



                }

            }



})


router.get("/me",authMiddleWare,async(req,res)=>{
let  userId = req.userId
try{
const userLogin = await  newUser.findById(userId).select("-Password");

if(!userLogin){

  return res.status(404).json({message:"user doesn't exist"});

}

res.status(200).json(userLogin)
}catch(e){
    res.status(500).json({
    message:"unexpected err in db"
})
}


})


router.post("/logout",(req,res)=>{


res.clearCookie("jwtToken",{


    httpOnly : true,
    secure :false,
    sameSite :"lax"
})

return res.status(200).json({

    message:"logout was success"
})
})



module.exports = router ;
