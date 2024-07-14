//第一步安裝 npm install express mysql ejs
//第二步安裝 npm install path

const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const app = express();
const path = require("path");

app.set("views", __dirname);

app.listen(3000, function () {
  console.log("port 3000!");
});

app.set("view engine", "ejs");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "spicesphere_sql",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.get("/", (req, res) => {
  let sql = "SELECT * FROM recipe";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("index", { recipes: result });
  });
});

app.get("/recipe", (req, res) => {
  let sql = "SELECT * FROM recipe";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result });
  });
});

app.get("/recipe/:id", (req, res) => {
  let sql = "SELECT * FROM recipe WHERE recipe_uid = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render("recipe_detail", { recipe: result[0] });
  });
});

app.get("/product", (req, res) => {
  let sql = "SELECT * FROM product";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/:id", (req, res) => {
  let sql = "SELECT * FROM product WHERE product_uid = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render("product_detail", { product: result[0] });
  });
});

app.use(express.static("../"));
app.use(express.static("jquery"));
app.use(express.static("CSS"));
