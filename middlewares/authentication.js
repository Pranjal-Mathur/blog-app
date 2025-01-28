const { verifytoken } = require("../services/authentication");

function checkforcookie(cookiename){
    return (req,res,next)=>{
        const tokenvalue = req.cookies[cookiename];
        if(!tokenvalue) {
            console.log("tokenvalue not found");
            return next();
        }

        try{
        const userpayload = verifytoken(tokenvalue);
        req.user = userpayload;
        }
        catch(err){console.log("Token verification failed...");}
        
        return next();
    }
}

module.exports = {checkforcookie};