const mongoose = require('mongoose');
const {randomBytes,createHmac} = require('crypto');
const { createtoken } = require('../services/authentication');


const userSchema =new  mongoose.Schema({

    fullName:{
        required:true,
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required : true,
    },
    salt:{
        type:String
    },
    profileimage:{
        type:String,
        default:"/images/im.jpg"
    },
    role:{
        type : String,
        enum : ["admin","user"],
        default:"user"
    }
})




userSchema.static("matchPasswordandcreateToken",async function (email,password) {

    const user = await this.findOne({email});
    if(!user) throw new Error('User not found');



    if (user.password != password) throw new Error("Incorrect password");

    const token = createtoken(user);
    return token;
} )

const User = mongoose.model('User',userSchema);

module.exports = User;
