const express = require('express')   //imports express
const connection = require('./db')    //imports db connection
require('express-async-errors')    // helps us with async errors
require('dotenv').config();        // access to dot env file
const cors = require('cors')     // imports cors
const Router = require('./Routes/Router')


const server = express()      

const port = 5000   //port
connection()    //db connection

server.use(cors())   //cors middleware
server.use(express.json())   // more middleswares
server.use('/api/v1', Router)
server.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });   //error handler middleware
  });



server.listen(port, () => {
    console.log(`Server is Running at port ${port}`)
})


module.exports = server