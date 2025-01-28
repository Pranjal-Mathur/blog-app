const express = require("express");
const router = express.Router();
const path = require("path");
const Blog = require("../models/blog");
const multer = require("multer");
const Comment = require("../models/comment");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads/")); 
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });


router.post('/comment/:blogid',async (req,res)=>{
    await Comment.create({
        content : req.body.comment,
        blogid : req.params.blogid,
        createdBy : req.user.id
    });
    return res.redirect(`/blog/${req.params.blogid}`);
})



router.get('/add', (req, res) => {
    
    console.log(req.user);
    if (!req.user) {
        return res.status(401).send("Unauthorized: Please log in to add a blog.");
    }
    res.render('addblog', { user: req.user });
});


router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        console.log(blog);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        const comments = await Comment.find({blogid:req.params.id}).populate("createdBy");
        console.log("comments hai ye -> ",comments);

        res.render('blog', { user: req.user, blog ,comments});
    } catch (err) {
        console.error("Error fetching blog:", err);
        res.status(500).send("Error fetching blog");
    }
});


router.post('/', upload.single('coverimage'), async (req, res) => {
    const { title, content } = req.body;

    try {
        
        if (!req.user ) {
            return res.status(401).send("Unauthorized: Please log in to create a blog.");
        }

        
        if (!req.file) {
            return res.status(400).send("Error: Cover image is required.");
        }

        console.log("Hii") ;       
        console.log("user:>",req.user);
        const blog = await Blog.create({
            title,
            content,
            createdBy: req.user.id,
            coverimage: `/uploads/${req.file.filename}`
        });

        res.redirect(`/blog/${blog._id}`);
    } catch (err) {
        console.error("Error creating blog:", err);
        res.status(500).send("Error creating blog. Please try again.");
    }
});

module.exports = router;







