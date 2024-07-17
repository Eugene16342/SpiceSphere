//第一步安裝 npm install express mysql ejs
//第二步安裝 npm install path

const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));

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

//以上都是設定

//首頁
app.get("/", (req, res) => {
  res.render("index");
});

//recipe路由  recipe_common為SQL指令，讓recipe表連接style和related
const recipe_common =
  "SELECT recipe.*, style.style_name AS style_name, related.related_name AS related_name FROM recipe LEFT JOIN style ON recipe.style = style.style_uid LEFT JOIN related ON recipe.related = related.related_uid";
app.get("/recipe", (req, res) => {
  let sql = recipe_common;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result });
  });
});

app.get("/recipe/sort/recipe_uid", (req, res) => {
  let sql = recipe_common + " ORDER BY recipe.recipe_uid DESC;";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result });
  });
});

app.get("/recipe/sort/click", (req, res) => {
  let sql = recipe_common + " ORDER BY click DESC";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result });
  });
});

app.get("/recipe/sort/click_desc", (req, res) => {
  let sql = recipe_common + " ORDER BY click";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result });
  });
});

app.get("/recipe/sort", (req, res) => {
  let style = req.query.style;
  let sql = recipe_common +  " WHERE style = ?";
  db.query(sql, [style], (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result });
  });
});

app.get("/recipe/:id", (req, res) => {
  let sql = "SELECT * FROM recipe WHERE recipe_uid = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render("recipe_detail", { items: result[0] });
  });
});

//product路由  product_common和食譜的作用一樣
const product_common =
  "SELECT product.*, related.related_name AS related_name FROM product LEFT JOIN related ON product.related = related.related_uid";
app.get("/product", (req, res) => {
  let sql = product_common;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/product_uid", (req, res) => {
  let sql = product_common + " ORDER BY product_uid DESC";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/click", (req, res) => {
  let sql = product_common + " ORDER BY click DESC";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/click_desc", (req, res) => {
  let sql = product_common + " ORDER BY click";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort", (req, res) => {
  let related = req.query.related;
  let sql = product_common +  " WHERE related = ?";
  db.query(sql, [related], (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/:id", (req, res) => {
  let sql = "SELECT * FROM product WHERE product_uid = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render("product_detail", { items: result[0] });
  });
});

app.use(express.static("../"));
app.use(express.static("jquery"));
app.use(express.static("CSS"));
