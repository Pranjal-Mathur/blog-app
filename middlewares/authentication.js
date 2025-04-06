const { verifytoken } = require("../services/authentication");

function checkforcookie(cookiename){
    return (req,res,next)=>{
        const tokenvalue = req.cookies[cookiename];
        if(!tokenvalue) {
            console.log("No authentication token found");
            req.user = null; // Explicitly set user to null when no token
            return next();
        }

        try {
            const userpayload = verifytoken(tokenvalue);
            if (!userpayload) {
                console.log("Invalid token payload");
                req.user = null;
                return next();
            }
            req.user = userpayload;
            console.log("User authenticated successfully:", userpayload.email);
        }
        catch(err) {
            console.log("Token verification failed:", err.message);
            req.user = null;
        }
        
        return next();
    }
}

module.exports = {checkforcookie};