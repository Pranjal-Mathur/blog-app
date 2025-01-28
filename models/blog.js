const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    content:{
        type:String,
        required:true
    },
    coverimage:{
        type:String
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required : true
    }
})

const Blog = mongoose.model("Blog",blogSchema);

module.exports = Blog;