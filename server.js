// Require http module
const http = require('http')
const morgan = require("morgan")
// Require fs module
const fs = require('fs')

const express = require('express')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Require minimist module (make sure you install this one via npm).
const args = require("minimist")(process.argv.slice(2))
// Use minimist to process one argument `--port=` on the command line after `node server.js`.

if (args["help"] == null){
const db = require('./database')

if(args["log"] == null || args["log"] == "true"){
  var logFlag = true
}else{logFlag = false}
// ^^ --log behavior 


var port = args["port"]
// Make this const default to port 3000 if there is no argument given for `--port`.
if (port == null){
  port = 3000
}
//console.log(port)
// Use the fs module to create an arrow function using `fs.readFile`.
// Use the documentation for the Node.js `fs` module. 
// The function must read a file located at `./www/index.html` and do some stuff with it.
// The stuff that should be inside this function is all below.
var server = app.listen(port, () => {
//  console.log(`App is running on port ${port}`)
})

app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
  }
  
  if(args["log"] != null && args["log"] != "true"){
    console.log("not logging")
  }else{
    const accessLog = fs.createWriteStream('access.log', { flags: 'a' })
    // Set up the access logging middleware
    app.use(
      morgan('combined', { stream: accessLog })
      )
  }
  const stmt = db.prepare(`INSERT INTO accesslog (remoteaddr ,
    remoteuser ,
    time ,
    method ,
    url ,
    protocol ,
    httpversion ,
    status ,
    referer ,
    useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
  next()
  })

app.get("/app", (req, res, next) => {
  res.json({"message":"Your API works! (200)"})
  res.status(200)
  
})

if(args["debug"] == "true"){
  /* must create endpoints

  --debug	If set to true, creates endlpoints /app/log/access/ which returns
              	a JSON access log from the database and /app/error which throws 
              	an error with the message "Error test successful." Defaults to 
		false.

*/
  app.get("/app/error", (req, res)=>{
    console.error('Error test successful.')
  })
 
  app.get("/app/log/access", (req, res, next) => {
    try{
      const stmt = db.prepare('SELECT * FROM accesslog').all()
      res.status(200).json(stmt)
    }catch(e){
      console.error(e)
    }
  })


}
//
app.use(function(req, res, next){
  res.json({"message":"Endpoint not found. (404)"})
  res.status(404)
  next()
})


// case in which --help used
}else{
  console.log(`server.js [options]

  --port		Set the port number for the server to listen on. Must be an integer
              	between 1 and 65535.

  --debug	If set to true, creates endlpoints /app/log/access/ which returns
              	a JSON access log from the database and /app/error which throws 
              	an error with the message "Error test successful." Defaults to 
		false.

  --log		If set to false, no log files are written. Defaults to true.
		Logs are always written to database.

  --help	Return this message and exit.`)
}