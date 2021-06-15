const express = require('express')   //imports express
const connection = require('./db')    //imports db connection
require('express-async-errors')    // helps us with async errors
require('dotenv').config();        // access to dot env file
const cors = require('cors')     // imports cors
const Router = require('./Routes/Router')



const server = express()      

const port = 5000; //port
server.use(cors());    //cors middleware

connection();  //db connection



server.use(express.json())   // more middleswares

server.use('/api/v1',Router)// server.use( Router)

server.use((error, request, response, next) => {

  
  response.status(500).send({ error: error.message });  //error handler middleware
  next()
  });



server.listen(port, () => {
    console.log(`Server is Running at port ${port}`)  // Server listening to port
})


module.exports = server