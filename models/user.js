const mongoose = require('mongoose');
const {randomBytes,createHmac} = require('crypto');
const { createtoken } = require('../services/authentication');

const userSchema = new mongoose.Schema({
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
});

// Hash password before saving
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(this.password)
        .digest('hex');
    
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchPasswordandcreateToken", async function(email, password) {
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found');

    const hashedPassword = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');

    if (user.password !== hashedPassword) throw new Error("Incorrect password");

    const token = createtoken(user);
    return token;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
