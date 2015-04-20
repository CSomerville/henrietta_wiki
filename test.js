var sqlite3 = require('sqlite3').verbose();
var henri = require('./henri.js');

var db = new sqlite3.Database('./wiki.db');

db.all("SELECT * FROM articles;", function(err, data){
  console.log(new henri.Article(data[0]));
})
