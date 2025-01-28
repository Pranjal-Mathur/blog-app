const jwt = require("jsonwebtoken");

const secret ="secret";

function createtoken (user){

    const payload = {
        id:user.id,
        email:user.email,
        role :user.role,
        fullName : user.fullName
    };
    try{
    const token = jwt.sign(payload,secret);
    return token;
    }
    catch(err){
        console.log("Token generation failed...");
    }
    

}


function verifytoken(token){

    if(!token) throw new Error('No token found..');
    const payload = jwt.verify(token,secret);
    return payload;
}

module.exports = {verifytoken,createtoken};