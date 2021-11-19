const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//Shiny rate was googled
const shinyRate = 1.0 / 450.0;

app.get("/", function (req, res) {
    res.render("index.ejs", {title: "Pokemon Game", jsPaths: ["script/tiles.js", "script/index.js"], cssStyles: []});
});
app.get("/designer", function (req, res) {
    res.render("designer.ejs", {title: "Level Designer - Pokemon Game", jsPaths: ["script/tiles.js", "script/designer.js"], cssStyles: ["designer"]})
});
app.listen(3000, function () {
    console.log("Server listening on port 3000");
});