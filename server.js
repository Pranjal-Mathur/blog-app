const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const userRoute = require('./routes/user.js');
const blogRoute = require('./routes/blog.js');
const Blog = require('./models/blog');


const db = require('./db.js');
const { checkforcookie } = require('./middlewares/authentication.js');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(checkforcookie("token"));
app.use(express.static(path.resolve('./public')));

app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.get("/",async (req,res)=>{
    
    console.log("Hello",req.user);
    const allBlogs = await Blog.find({});
    res.render('home.ejs',{
        user:req.user,
        blogs:allBlogs
    });

    
})







app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})