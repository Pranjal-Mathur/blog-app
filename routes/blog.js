const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");
const multer = require("multer");
const Comment = require("../models/comment");

// Ensure uploads directory exists
const uploadDir = path.resolve("./public/uploads/");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

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
    try {
        if (!req.user) {
            return res.redirect('/user/signin');
        }

        if (req.fileValidationError) {
            return res.status(400).render('error', {
                message: req.fileValidationError,
                user: req.user
            });
        }

        if (!req.file) {
            return res.status(400).render('error', { 
                message: "Please select an image to upload",
                user: req.user 
            });
        }

        const { title, content } = req.body;
        
        if (!title || !content) {
            // Delete the uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).render('error', {
                message: "Title and content are required",
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
        // Delete the uploaded file if blog creation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).render('error', { 
            message: "Error creating blog. Please try again.",
            user: req.user 
        });
    }
});

module.exports = router;








