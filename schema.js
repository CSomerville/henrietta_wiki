var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./wiki.db');

db.serialize(function(){
  if (process.argv[2] === "drop") {
    db.run("DROP TABLE users;")
    db.run("DROP TABLE articles;")
    db.run("DROP TABLE edits;")
    db.run("DROP TABLE categories;")
  }
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR, email VARCHAR, team VARCHAR);");
  db.run("CREATE TABLE articles (id INTEGER PRIMARY KEY, creation_date INTEGER, subject VARCHAR, category_id INTEGER, content TEXT, user_id INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id), FOREIGN KEY(user_id) REFERENCES users(id));")
  db.run("CREATE TABLE edits (id INTEGER PRIMARY KEY, edit_date INTEGER, prev_content TEXT, new_content TEXT, article_id, user_id, FOREIGN KEY(article_id) REFERENCES articles(id), FOREIGN KEY(user_id) REFERENCES users(id));")
  db.run("CREATE TABLE categories (id INTEGER PRIMARY KEY, name VARCHAR);")
})