const database = require('better-sqlite3')

const logdb = new database('log.db')

const stmt = logdb.prepare("SELECT name FROM sqlite_master WHERE type='table' and 'access';")
let row = stmt.get();
if (row === undefined){
    console.log("log database missing. Creating log database.")
    logdb.exec("CREATE TABLE userinfo (id INTEGER PRIMARY KEY, username TEXT, password TEXT); INSERT INTO userinfo (user, pass) VALUES ('user1','supersecurepassword'),('test','anotherpassword');)")

}else{
    console.log("Log database exists")
}

module.exports = logdb