const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const userRoute = require('./routes/user.js');
const blogRoute = require('./routes/blog.js');
const Blog = require('./models/blog');
const cors = require('cors');

const db = require('./db.js');
const { checkforcookie } = require('./middlewares/authentication.js');

const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: '*', // For development, use specific origins for production
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

// Apply authentication middleware only to specific routes
app.use('/user', checkforcookie("token"), userRoute);
app.use('/blog', checkforcookie("token"), blogRoute);
app.get("/", checkforcookie("token"), async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home.ejs',{
        user:req.user,
        blogs:allBlogs
    });
});

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
});