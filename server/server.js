// import packages
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

// import database

// import routers

// middleware
app.use(express.json());

// router use

// server listen
app.listen(process.env.PORT, ()=>{
    console.log(`The server is running on port : ${process.env.PORT}`);
})