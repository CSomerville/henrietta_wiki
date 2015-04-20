var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var Mustache = require('mustache');
var marked = require('marked');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var henri = require('./henri.js');

var db = new sqlite3.Database('./wiki.db')
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(express.static('public'));

function stripMd(string) {
  return string.replace(/\n?\*?\#/g, "");
}

function assignDivs(articles, offset) {
  var chars = "abcdefghijklmno".split("");
  articles.forEach(function(article, index){
    article.divClass = chars[(index + offset) % 15];
    article.colorClass = ((index + offset) % 2 === 0) ? "gold" : "green";
  })
  return articles;
}

app.get('/', function(req, res){
  fs.readFile('./views/index.html', 'utf8', function(err, page){
    db.all("SELECT * FROM categories;", function(err, categories){
      db.all("SELECT * FROM users;", function(err, users){
        db.all("SELECT * FROM articles ORDER BY creation_date DESC;", function(err, recentArticles){
          var articles = [];
          recentArticles.slice(0,10).forEach(function(article){
            article = new henri.Article(article);
            article.getAuthorName(article, function(){
              article.getCategoryName(article, function(){
                articles.push(article);
                if (articles.length === recentArticles.slice(0,10).length) {
                  res.send(Mustache.render(page, {users: users, categories: categories, articles: assignDivs(articles, 3)}));
                }
              })
            })
          })
        })
      })
    })
  })
})

app.get('/categories', function(req,res){
  if (req.query.category) res.redirect('/categories/' + req.query.category);
})

app.get('/categories/:id', function(req, res){
  fs.readFile('./views/category.html', 'utf8', function(err, page){
    db.all("SELECT * FROM categories WHERE id = " + req.params.id + ";", function(err, category){
      category = new henri.Category(category[0]);
      category.getArticles(category, function(){
        var articles = [];
        category.articles.forEach(function(article){
          article.getAuthorName(article, function(){
            articles.push(article);
            if (articles.length === category.articles.length) {
              category.articles = assignDivs(articles, 3);
              res.send(Mustache.render(page, category));
            }
          })
        })
      })
    })
  })
})

app.get('/articles/new', function(req,res){
  fs.readFile('./views/new.html', 'utf8', function(err, page){
    db.all("SELECT * FROM users;", function(err, users){
      db.all("SELECT * FROM categories;", function(err, categories){
        res.send(Mustache.render(page, {users: users, categories: categories}));
      })
    })
  })
})

app.get('/articles/:id', function(req,res){
  fs.readFile('./views/show.html', 'utf8', function(err, page){
    db.all("SELECT * FROM articles WHERE id = " + req.params.id + ";", function(err, article){
      article = new henri.Article(article[0]);
      article.getAuthorName(article, function(){
        article.getCategoryName(article, function(){
          article.markifyContent(article, function(){
            article.getLastEdit(article, function(){
              edit = new henri.Edit(article.lastEdit);
              edit.getEditAuthor(edit, function(){
                article.editAuthor = edit.editAuthor;
                article.niceEditDate = edit.niceEditDate;
                res.send(Mustache.render(page, article));                            
              })
            })
          })
        })
      })
    })
  })
})

app.get('/articles/:id/edit', function(req,res){
  fs.readFile('./views/edit.html', 'utf8', function(err, page){
    db.all("SELECT * FROM articles WHERE id= " + req.params.id + ";", function(err, article){
      db.all("SELECT name FROM users WHERE id = " + article[0].user_id + ";", function(err, user){
        db.all("SELECT * FROM users;", function(err,users){
          article[0]["author"] = user[0].name;
          article[0]["users"] = users;
          res.send(Mustache.render(page, article[0]));          
        })
      })
    })
  })
})

app.get('/articles/:id/edits', function(req, res){
  fs.readFile('./views/edit_history.html', 'utf8', function(err, page){
    db.all("SELECT * FROM articles WHERE id = " + req.params.id + ";", function(err, article){
      article = new henri.Article(article[0]);
      article.getEdits(article, function(){
        var edits = [];
        article.edits.forEach(function(edit){
          edit.getEditAuthor(edit, function(){
            edits.push(edit);
            if (edits.length === article.edits.length) {
              article.edits = assignDivs(edits, 3);
              res.send(Mustache.render(page, article));
            }
          })
        })
      })
        // db.all("SELECT * FROM edits WHERE article_id = " + req.params.id + ";", function(err, history){
      //   db.all("SELECT * FROM users WHERE id = " + article[0].user_id + ";", function(err, user){
      //     article[0]["author"] = user[0].name;
      //     article[0]["creation_date"] = new Date(article[0].creation_date).toString().slice(0,21);
      //     var edits = [];
      //     history.forEach(function(edit){
      //       db.all("SELECT name FROM users WHERE id = " + edit.user_id + ";", function(err, user){
      //         edits.push({user: user[0].name, edit_date: new Date(edit.edit_date).toString().slice(0,21)});
      //         edits = assignDivs(edits, 3)
      //         if (edits.length === history.length) {
      //           article[0]["edits"] = edits;
      //           res.send(Mustache.render(page, article[0]));
      //         }   
      //       })
      //     })
      //   })
      // })
    })
  })
})

app.get('/users', function(req,res){
  if (req.query.user) res.redirect('/users/' + req.query.user);
})

app.get('/users/:id', function(req, res){
  fs.readFile('./views/user.html', 'utf8', function(err, page){
    db.all("SELECT * FROM users WHERE id = " + req.params.id + ";", function(err, user){
      user = new henri.User(user[0]);
      user.getArticles(user, function(){
        var articles = [];
        user.articles.forEach(function(article){
          article.getCategoryName(article, function(){
            articles.push(article);
            if (articles.length === user.articles.length) {
              user.articles = assignDivs(articles, 3);
              res.send(Mustache.render(page, user));
            }
          })
        })
      })
    })
  })
})

app.post('/articles', function(req, res){
  db.run("INSERT INTO articles (creation_date, subject, category_id, content, user_id) VALUES (" + Date.parse(new Date()) + ",'" + req.body.subject + "'," + req.body.category + ",'" + req.body.content.replace(/'/g, "''") + "'," + req.body.user + ");");
  res.redirect('/');
})

app.put('/articles/:id', function(req, res){
  db.run("UPDATE articles SET content = '" + req.body.content.replace(/'/g, "''") + "' WHERE id=" + req.params.id + ";");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse(new Date()) + "," + req.params.id + "," + req.body.user + ");")
  res.redirect('/articles/' + req.params.id);
})

app.listen(3000, function(){
  console.log("all ears")
})















