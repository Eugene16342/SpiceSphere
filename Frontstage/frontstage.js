const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const session = require("express-session");
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

app.get("/recipe_page", (req, res) => {
  res.render("recipe_page");
});

app.get("/product_section", (req, res) => {
  res.render("product_section");
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
