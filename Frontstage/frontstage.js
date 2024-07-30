const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.listen(3001, function () {
  console.log("port 3001!");
});

app.get("/home_page", (req, res) => {
  res.render("home_page");
});

app.get("/recipe_section", (req, res) => {
  res.render("recipe_section");
});

// const recipe_common =
//   "SELECT recipe.*, style.style_name AS style_name, related.related_name AS related_name FROM recipe LEFT JOIN style ON recipe.style = style.style_uid LEFT JOIN related ON recipe.related = related.related_uid";


  app.get("/recipe_section/recipe_page/:id", (req, res) => {
    fetch(`http://localhost:3000/api/recipe/${req.params.id}`)
      .then(response => response.json())
      .then(data => {
        res.render("recipe_page", data);
      });
  });

app.get("/product_section", (req, res) => {
  res.render("product_section");
});

app.get("/product_section/product_page/:id", (req, res) => {
  fetch(`http://localhost:3000/api/product/${req.params.id}`)
    .then(response => response.json())
    .then(data => {
      res.render("product_page", data);
    });
});


app.get("/product_page", (req, res) => {
  res.render("product_page");
});

app.get("/payment", (req, res) => {
  res.render("payment");
});

app.use(express.static("../"));
app.use(express.static("jquery"));
app.use(express.static("CSS"));
// app.use(ensureAuthenticated);