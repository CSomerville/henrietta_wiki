var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var Mustache = require('mustache');
var marked = require('marked');
var morgan = require('morgan');

var db = new sqlite3.Database('./wiki.db')
var app = express();

app.use(morgan('dev'));

function stripMd(string) {
  return string.replace(/\n?\*?\#/g, "");
}

app.get('/', function(req, res){
  fs.readFile('./views/index.html', 'utf8', function(err, page){
    db.all("SELECT * FROM categories;", function(err, categories){
      db.all("SELECT * FROM articles ORDER BY creation_date ASC;", function(err, recentArticles){
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
          console.log(user);
          article["author"] = user[0].name;
          article["content"] = stripMd(article.content.slice(0,150)) + "...";
          articles.push(article);
          if (articles.length === categoryArticles.length) res.send(Mustache.render(page, {articles: articles}));   
        })
      })
    })
  })
})

app.listen(3000, function(){
  console.log("all ears")
})















