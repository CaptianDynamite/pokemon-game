const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index.ejs", {title: "Pokemon Game", jsPath: "script/index.js"});
});

app.listen(3000, function () {
    console.log("Server listening on port 3000");
});