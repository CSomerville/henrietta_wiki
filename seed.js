var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./wiki.db');

var content1 = "Carles bicycle rights tattooed, Bushwick readymade biodiesel Intelligentsia literally American Apparel distillery street art sriracha seitan. Butcher hashtag McSweeney's drinking vinegar, vinyl skateboard asymmetrical polaroid cornhole artisan disrupt Carles food truck. Asymmetrical tilde Godard cray, beard scenester gentrify YOLO kogi Odd Future single-origin coffee cred. Leggings 90's wayfarers tattooed iPhone. Tousled put a bird on it messenger bag locavore normcore, next level Echo Park pug gluten-free bitters fashion axe salvia. Pitchfork leggings migas chia, organic meh pug listicle try-hard. PBR Intelligentsia cornhole semiotics iPhone, letterpress bitters pickled distillery kale chips crucifix selfies dreamcatcher High Life.".replace(/'/g, "")

var content2 = "Schlitz you probably haven't heard of them selfies selvage. Put a bird on it freegan readymade narwhal 3 wolf moon. Kale chips Marfa Pitchfork next level keytar. McSweeney's dreamcatcher VHS church-key. Ethical American Apparel bitters organic Schlitz skateboard. 3 wolf moon mixtape normcore hashtag dreamcatcher swag. 90's four loko iPhone migas butcher blog, beard quinoa hella bespoke.".replace(/'/g, "")

var content3 = "Shoreditch flannel small batch polaroid Bushwick, Kickstarter keffiyeh Schlitz PBR master cleanse. Gentrify organic slow-carb blog, iPhone yr PBR&B twee kogi Pitchfork selvage put a bird on it. Raw denim freegan tilde butcher, you probably haven't heard of them Etsy ugh normcore keytar fashion axe selvage heirloom lomo Helvetica Pinterest. Organic sartorial mustache Carles Pinterest American Apparel, shabby chic cold-pressed. Asymmetrical dreamcatcher deep v raw denim, Shoreditch wolf messenger bag Truffaut. Messenger bag food truck occupy, salvia kitsch tote bag paleo art party meditation crucifix XOXO PBR asymmetrical. Mustache Neutra squid, dreamcatcher fashion axe cray chillwave literally heirloom put a bird on it.".replace(/'/g, "")


db. serialize(function(){
  db.run("PRAGMA foreign_keys = ON;");
  db.run("INSERT INTO users (name, email, team) VALUES ('henrietta', 'henrietta@henrietta.uh', 'executicution');");
  db.run("INSERT INTO users (name, email, team) VALUES ('adelaide', 'adelaide@henrietta.uh', 'polydenigration');");
  db.run("INSERT INTO users (name, email, team) VALUES ('todd', 'todd@henrietta.uh', 'blood snorkling');");
  db.run("INSERT INTO articles (creation_date, subject, category, content, user_id) VALUES (" + Date.parse('02/06/2666') + ",'accelerating resource exhaustion', 'blue-sky thinking', '" + content1 +"', 3);")
  db.run("INSERT INTO articles (creation_date, subject, category, content, user_id) VALUES (" + Date.parse('08/08/2019') + ",'maximizing prosumer battle-royale', 'issues', '" + content2 +"', 2);")
  db.run("INSERT INTO articles (creation_date, subject, category, content, user_id) VALUES (" + Date.parse('02/06/2666') + ",'make time for nanny interface', 'work-life balance', '" + content3 +"', 3);");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse('01/01/3000') + ", 1, 2);");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse('01/03/3000') + ", 1, 2);");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse('02/14/3010') + ", 3, 1);");

})