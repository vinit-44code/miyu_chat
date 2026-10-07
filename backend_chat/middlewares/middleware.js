const jwt =require("jsonwebtoken");

const authMiddleWare = (req,res,next)=>{

const token = req.cookies.jwtToken;

if(!token){

    return res.status(401).json({
        message:"auth required  "
    })
}

try{

    const decode = jwt.verify(token,process.env.JWT_SECRET);
                req.userId = decode.userId;
                next();


}catch(e){


res.status(401).json({

    message : "invalid session id or session expried"
})


}

}


module.exports = authMiddleWare;