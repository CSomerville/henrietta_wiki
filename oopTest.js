var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./wiki.db');

var Article = function(article){
  this.id = article.id,
  this.creation_date = article.creation_date,
  this.niceCreationDate = new Date(article.creation_date).toString().slice(0,21);
  this.subject = article.subject,
  this.category_id = article.category_id,
  this.content = article.content,
  this.stubContent = (article.content.slice(0,150) + "...").replace(/\n|\*|\#/g, "");
  this.user_id = article.user_id,
  this.getCategoryName = function(article, cb) {
    db.all("SELECT name FROM categories WHERE id = " + this.category_id + ";", function(err, name){
      article.categoryName = name[0].name;
      cb();
    })
  },
  this.getAuthorName = function(article, cb) {
    db.all("SELECT name FROM users WHERE id = " + this.user_id + ";", function(err, name){
      article.authorName = name[0].name;
      cb();
    })
  },
  this.getLastEdit = function(article, cb) {
    db.all("SELECT * FROM edits WHERE article_id = " + this.id + " ORDER BY edit_date DESC;", function(err, edits){
      article.lastEdit = edits[0];
      cb();
    })
  }
}

var User = function(user) {
  this.userId = user.id,
  this.userName = user.name,
  this.email = user.email,
  this.team = user.team,
  this.articles = [],
  this.getArticles = function(user, cb) {
    db.all("SELECT * FROM articles WHERE user_id = " + user.userId + ";", function(err, articles){
      articles.forEach(function(eachArticle){
        user.articles.push(new Article(eachArticle));
      })
      cb();
    })
  }
}

var Category = function(category) {
  this.categoryId = category.id,
  this.categoryName = category.name,
  this.articles = [],
  this.getArticles = function(category, cb) {
    db.all("SELECT * FROM articles WHERE category_id = " + category.categoryId + ";", function(err, articles){
      articles.forEach(function(eachArticle){
        category.articles.push(new Article(eachArticle));
      })
      cb();
    })
  }
}



db.all("SELECT * FROM articles", function(err, data){
  var firstArticle = new Article(data[0]);
  firstArticle.getCategoryName(firstArticle, function(){
    console.log(firstArticle.stubContent);
    console.log(firstArticle.niceCreationDate);
    firstArticle.getAuthorName(firstArticle, function(){
      console.log(firstArticle.authorName);
      firstArticle.getLastEdit(firstArticle, function(){
        console.log(firstArticle.lastEdit);
      })
    })
  })
})

// db.all("SELECT * FROM users WHERE id = 2;", function(err, aUser){
//   aUser = new User(aUser[0]);
//   console.log(aUser);
//   aUser.getArticles(aUser, function(){
//     console.log(aUser.articles);
//   })
// })

db.all("SELECT * FROM categories WHERE id = 2;", function(err, aCategory){
  aCategory = new Category(aCategory[0]);
  console.log(aCategory);
  aCategory.getArticles(aCategory, function(){
    console.log(aCategory.articles);
  })
})