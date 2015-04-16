var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./wiki.db');

var ipsumJunk = "Tote bag disrupt chambray roof party, street art polaroid flexitarian irony keytar Wes Anderson PBR&B Portland aesthetic authentic. Heirloom trust fund roof party, vegan cold-pressed Banksy 3 wolf moon scenester Carles. Pitchfork plaid deep v ethical occupy umami. Carles typewriter mixtape beard stumptown trust fund. XOXO trust fund single-origin coffee, wayfarers cardigan chillwave YOLO kogi shabby chic umami four loko. Slow-carb quinoa dreamcatcher meggings Etsy synth. Slow-carb before they sold out cray drinking vinegar, stumptown Williamsburg flexitarian. Brunch slow-carb readymade kale chips. 3 wolf moon migas meditation, yr disrupt Pitchfork umami four dollar toast PBR&B. Hoodie lo-fi viral, Shoreditch cliche hashtag Carles migas master cleanse Truffaut leggings before they sold out seitan Tumblr. Pour-over next level pickled, put a bird on it lo-fi Marfa Wes Anderson butcher pop-up fixie flannel crucifix sartorial. Try-hard sustainable vegan 90's. Gentrify bespoke tote bag Helvetica, chia food truck PBR literally you probably haven't heard of them scenester. Gentrify plaid authentic, polaroid cliche cold-pressed locavore Echo Park whatever art party lomo food truck. Helvetica viral photo booth Godard stumptown mlkshk bitters, chambray irony bicycle rights pop-up skateboard keffiyeh roof party. Dreamcatcher Pinterest fingerstache, pug sustainable YOLO Carles squid PBR letterpress. Sriracha chia Williamsburg craft beer. 8-bit crucifix kitsch stumptown, leggings forage salvia Echo Park next level Intelligentsia. Ennui Shoreditch aesthetic, brunch PBR&B retro stumptown Etsy beard Pitchfork squid Odd Future art party vinyl 8-bit. Blue Bottle fap quinoa, dreamcatcher biodiesel deep v American Apparel fingerstache pour-over ennui. Freegan Godard Bushwick photo booth, selfies tousled bitters Austin drinking vinegar. +1 Marfa pour-over disrupt 3 wolf moon roof party, twee food truck fixie semiotics American Apparel banh mi synth Helvetica. Pug hoodie twee bicycle rights. Stumptown tattooed Neutra farm-to-table, sartorial Etsy blog PBR deep v retro dreamcatcher twee Tumblr viral cronut. Blue Bottle narwhal listicle, street art cray four loko disrupt fanny pack deep v letterpress asymmetrical. Banksy scenester YOLO, McSweeney's asymmetrical 3 wolf moon banjo vegan hoodie cold-pressed skateboard small batch tofu. Authentic Vice American Apparel actually chia, PBR&B High Life fashion axe umami distillery. 3 wolf moon direct trade Echo Park, church-key next level locavore swag 8-bit sustainable 90's readymade skateboard.".replace(/'/g, "''")

function randStart(string) {
  var array = string.split(".")
  var rando = Math.floor(Math.random() * array.length);
  return (array.slice(rando).join(".") + array.slice(0, rando).join("."))
}

function markdownify(raw) {
  var array = raw.split(".");
  array.forEach(function(sentence, index){
    var zeroToFour = Math.floor(Math.random() * 5);
    switch (zeroToFour) {
      case 0:
        array[index] = "\n###" + sentence + ".\n\n";
        break;
      case 1:
        array[index] = "\n*" + sentence.split(",").join(".\n*") + ".\n\n";
        break;
      default:
        array[index] = sentence + ".";
        break;
    }
  })
  return array.join("");
}


db. serialize(function(){
  db.run("PRAGMA foreign_keys = ON;");
  db.run("INSERT INTO users (name, email, team) VALUES ('henrietta', 'henrietta@henrietta.uh', 'executicution');");
  db.run("INSERT INTO users (name, email, team) VALUES ('adelaide', 'adelaide@henrietta.uh', 'polydenigration');");
  db.run("INSERT INTO users (name, email, team) VALUES ('todd', 'todd@henrietta.uh', 'blood snorkling');");
  db.run("INSERT INTO articles (creation_date, subject, category, content, user_id) VALUES (" + Date.parse('02/06/2666') + ",'accelerating resource exhaustion', 'blue-sky thinking', '" + markdownify(randStart(ipsumJunk)) +"', 3);")
  db.run("INSERT INTO articles (creation_date, subject, category, content, user_id) VALUES (" + Date.parse('08/08/2019') + ",'maximizing prosumer battle-royale', 'issues', '" + markdownify(randStart(ipsumJunk)) +"', 2);")
  db.run("INSERT INTO articles (creation_date, subject, category, content, user_id) VALUES (" + Date.parse('02/06/2666') + ",'make time for nanny interface', 'work-life balance', '" + markdownify(randStart(ipsumJunk)) +"', 3);");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse('01/01/3000') + ", 1, 2);");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse('01/03/3000') + ", 1, 2);");
  db.run("INSERT INTO edits (edit_date, article_id, user_id) VALUES (" + Date.parse('02/14/3010') + ", 3, 1);");

})