const mongoose = require('mongoose');
require("dotenv").config();
const URL = process.env.MONGO_URL;
mongoose.connect(URL);
const db = mongoose.connection;


db.on("connected",()=>{
    console.log("Database connected");
 })
  
db.on("disconnected",()=>{
    console.log("Database disconnected");
 })
 
db.on("error",()=>{
    console.log("Database error");
 })

 module.exports = db;


