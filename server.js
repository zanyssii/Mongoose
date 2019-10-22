
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var path = require('path'); 
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 5000;
var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('veiws', path.join(__dirname, 'views/'));

app.use(express.static("folder"));

app.engine(
    "handlebars",
    exphbs({
       defaultLayout: "main",
        layoutsDir: __dirname + '/views/layout/',
        partialsDir: __dirname + '/partial/'
    })
);
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headlinesDB";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
app.set('views', path.join(__dirname, 'views/'));
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


module.exports = app;