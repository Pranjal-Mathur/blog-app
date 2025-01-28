const express = require('express');
const router = express.Router();
const User = require('./../models/user');



router.get('/signin',(req,res)=>{
    res.render('signin');
})
router.post('/signin', async (req,res)=>{
    
    const {email,password} = req.body;
    try{
    
    const token = await User.matchPasswordandcreateToken(email,password);
    return res.cookie("token",token).redirect("/");
    }
    catch(err){
        return res.render("signin",{error:"Incorrect credentials"});
    }
})

router.get('/signup',(req,res)=>{
    
    res.render('signup');

})

router.post('/signup',async (req,res)=>{

    try{
    const data = req.body;
    const newUser = new User(data);
    const savedUser = await newUser.save();
    
    console.log("User saved...");

    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal server error");
    }

    return res.redirect("/");
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports = router;