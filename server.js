// Require http module
const http = require('http')
// Require fs module
const fs = require('fs')

const express = require('express')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const db = require('./database')
// Require minimist module (make sure you install this one via npm).
const args = require("minimist")(process.argv.slice(2))
// Use minimist to process one argument `--port=` on the command line after `node server.js`.
args["port"]
// Define allowed argument name 'port'.
const port = args.port || process.env.PORT || 3000
// Define a const `port` using the argument from the command line. 
// Make this const default to port 3000 if there is no argument given for `--port`.

// Use the fs module to create an arrow function using `fs.readFile`.
// Use the documentation for the Node.js `fs` module. 
// The function must read a file located at `./www/index.html` and do some stuff with it.
// The stuff that should be inside this function is all below.
var server = app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})

app.get("/app/", (req, res, next) => {
  res.json({"message":"Your API works! (200)"})
  res.status(200)
})

app.post("/app/new/user",(req, res, next) => {

})

app.get("/app/users", (req, res) =>{
  try{
    const stmt = db.prepare('SELECT * FROM userinfo').all()
    res.status(200).json(stmt)
  }catch{
    console.error(e)
  }
})

app.get("/app/user/:id", (req, res) =>{

})

app.patch("/app/update/user/:id", (req, res) => {
  try{
    const stmt = db.prepare("SELECT * FROM userinfo WHERE id = ?").get(req.params.id)
    res.status(200).json(stmt)
  } catch(e){
    console.error(e)
  }
})
app.delete("/app/delete/user/:id", (req, res) => {

})

app.use(function(req, res){
  res.json({"message":"Endpoint not found. (404)"})
  res.status(404)
})