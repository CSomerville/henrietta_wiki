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
    db.all("SELECT * FROM articles WHERE category_id = " + req.query.category + ";", function(err, categoryArticles){
      var articles = [];
      categoryArticles.forEach(function(article){
        db.all("SELECT name FROM users WHERE id = " + article.user_id + ";", function(err, user){
          article["author"] = user[0].name;
          article["content"] = stripMd(article.content.slice(0,150)) + "...";
          articles.push(article);
          if (articles.length === categoryArticles.length) res.send(Mustache.render(page, {articles: articles}));   
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
          article[0]["author"] = user[0].name;
          marked(article[0].content, function(err, html){
            article[0]["content"] = html;
            res.send(Mustache.render(page, article[0]));            
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















