var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var Mustache = require('mustache');
var marked = require('marked');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = new sqlite3.Database('./wiki.db')
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));

function stripMd(string) {
  return string.replace(/\n?\*?\#/g, "");
}

app.get('/', function(req, res){
  fs.readFile('./views/index.html', 'utf8', function(err, page){
    db.all("SELECT * FROM categories;", function(err, categories){
      db.all("SELECT * FROM articles ORDER BY creation_date DESC;", function(err, recentArticles){
        var articles = [];
        recentArticles.slice(0,10).forEach(function(article){
          db.all("SELECT name FROM users WHERE id =" + article.user_id + ";", function(err, user){
            db.all("SELECT name FROM categories WHERE id =" + article.category_id + ";", function(err, category){
              article["author"] = user[0].name;
              article["category"] = category[0].name;
              article["content"] = stripMd(article.content.slice(0,150)) + "...";
              articles.push(article);
              if (articles.length === recentArticles.slice(0,10).length) {
                res.send(Mustache.render(page, {categories: categories,articles: articles}));
              }
            })
          })
        })
      })
    })
  })
})

app.get('/categories', function(req, res){
  fs.readFile('./views/category.html', 'utf8', function(err, page){
    db.all("SELECT name FROM categories WHERE id = " + req.query.category + ";", function(err, category){      
      db.all("SELECT * FROM articles WHERE category_id = " + req.query.category + ";", function(err, categoryArticles){
        var articles = [];
        categoryArticles.forEach(function(article){
          db.all("SELECT * FROM users WHERE id = " + article.user_id + ";", function(err, user){
            article["author"] = user[0].name;
            article["content"] = stripMd(article.content.slice(0,150)) + "...";
            article["user_id"] = user[0].id;
            articles.push(article);
            if (articles.length === categoryArticles.length) res.send(Mustache.render(page, {category: category[0].name, articles: articles})); 
          })
        })
      })
    })
  })
})

app.get('/articles/:id', function(req,res){
  if (req.params.id === 'new') {
    fs.readFile('./views/new.html', 'utf8', function(err, page){
      db.all("SELECT * FROM users;", function(err, users){
        db.all("SELECT * FROM categories;", function(err, categories){
          res.send(Mustache.render(page, {users: users, categories: categories}));
        })
      })
    })
  } else {
    fs.readFile('./views/show.html', 'utf8', function(err, page){
      db.all("SELECT * FROM articles WHERE id = " + req.params.id + ";", function(err, article){
        db.all("SELECT name FROM users WHERE id = " + article[0].user_id + ";", function(err, user){
          db.all("SELECT name FROM categories WHERE id = " + article[0].category_id + ";", function(err, category){
            db.all("SELECT * FROM edits WHERE article_id = " + req.params.id + " ORDER BY edit_date DESC;", function(err, edits){
              article[0]["category"] = category[0].name;
              article[0]["author"] = user[0].name;
              if (edits[0]) {
                db.all("SELECT name FROM users WHERE id = " + edits[0].user_id + ";", function(err, edit_user){
                  article[0]["last_edit_date"] = new Date(edits[0].edit_date).toString().slice(0,21);
                  article[0]["last_edit_author"] = edit_user[0].name;
                  marked(article[0].content, function(err, html){
                    article[0]["content"] = html;
                    res.send(Mustache.render(page, article[0]));                        
                  })
                })
              } else {
                marked(article[0].content, function(err, html){
                  article[0]["content"] = html;
                  res.send(Mustache.render(page, article[0]));                        
                })
              }            
            })
          })
        })
      })
    })
  }
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
    db.all("SELECT * FROM edits WHERE article_id = " + req.params.id + ";", function(err, history){
      db.all("SELECT * FROM articles WHERE id = " + req.params.id + ";", function(err, article){
        db.all("SELECT * FROM users WHERE id = " + article[0].user_id + ";", function(err, user){
          article[0]["author"] = user[0].name;
          article[0]["creation_date"] = new Date(article[0].creation_date).toString().slice(0,21);
          var edits = [];
          history.forEach(function(edit){
            db.all("SELECT name FROM users WHERE id = " + edit.user_id + ";", function(err, user){
              edits.push({user: user[0].name, edit_date: new Date(edit.edit_date).toString().slice(0,21)});
              if (edits.length === history.length) {
                article[0]["edits"] = edits;
                res.send(Mustache.render(page, article[0]));
              }   
            })
          })
        })
      })
    })
  })
})

app.get('/users/:id', function(req, res){
  fs.readFile('./views/user.html', 'utf8', function(err, page){
    db.all("SELECT * FROM users WHERE id = " + req.params.id + ";", function(err, user){
      db.all("SELECT * FROM articles WHERE user_id = " + req.params.id + ";", function(err, userArticles){
        console.log(userArticles);
        var articles = [];
        userArticles.forEach(function(article){
          db.all("SELECT name FROM categories WHERE id = " + article.category_id + ";", function(err, category){
            article["category"] = category[0].name;
            article["content"] = stripMd(article.content.slice(0,150)) + "...";
            articles.push(article);
            if (articles.length === userArticles.length) {
              user[0]["articles"] = articles;
              res.send(Mustache.render(page, user[0]))
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















