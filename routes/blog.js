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

router.post('/comment/:blogid', async (req, res) => {
    try {
        await Comment.create({
            content: req.body.comment,
            blogid: req.params.blogid,
            createdBy: req.user.id
        });
        return res.redirect(`/blog/${req.params.blogid}`);
    } catch (err) {
        console.error("Error creating comment:", err);
        return res.status(500).send("Error creating comment");
    }
});

router.get('/add', (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    res.render('addblog', { user: req.user });
});

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        if (!blog) {
            return res.status(404).render('error', { 
                message: "Blog not found",
                user: req.user 
            });
        }

        const comments = await Comment.find({ blogid: req.params.id }).populate("createdBy");
        res.render('blog', { 
            user: req.user, 
            blog,
            comments 
        });
    } catch (err) {
        console.error("Error fetching blog:", err);
        res.status(500).render('error', { 
            message: "Error fetching blog",
            user: req.user 
        });
    }
});

router.post('/', upload.single('coverimage'), async (req, res) => {
    const { title, content } = req.body;

    try {
        if (!req.user) {
            return res.redirect('/user/signin');
        }

        if (!req.file) {
            return res.status(400).render('error', { 
                message: "Cover image is required",
                user: req.user 
            });
        }

        const blog = await Blog.create({
            title,
            content,
            createdBy: req.user.id,
            coverimage: `/uploads/${req.file.filename}`
        });

        res.redirect(`/blog/${blog._id}`);
    } catch (err) {
        console.error("Error creating blog:", err);
        res.status(500).render('error', { 
            message: "Error creating blog. Please try again.",
            user: req.user 
        });
    }
});

module.exports = router;








