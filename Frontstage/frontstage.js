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

///////////////////////////////////////

// app.use(
//   session({
//     secret: "SpiceSphere20240827",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // 如果您的網站使用 HTTPS，請將此選項設為 true
//   })
// );

// app.use((req, res, next) => {
//   res.locals.username = req.session.username || "請先登入";
//   next();
// });

/////////////////////////////////////////

app.get("/home_page", (req, res) => {
  res.render("home_page");
});

app.get("/recipe_section", (req, res) => {
  res.render("recipe_section");
});


const recipe_common =
  "SELECT recipe.*, style.style_name AS style_name, related.related_name AS related_name FROM recipe LEFT JOIN style ON recipe.style = style.style_uid LEFT JOIN related ON recipe.related = related.related_uid";

  app.get("/recipe_section/recipe_page/:id", (req, res) => {
    let sql =  "SELECT recipe.*, style.style_name AS style_name, related.related_name AS related_name, ingredients_for_recipe.* FROM recipe LEFT JOIN style ON recipe.style = style.style_uid LEFT JOIN related ON recipe.related = related.related_uid LEFT JOIN ingredients_for_recipe ON recipe.recipe_uid = ingredients_for_recipe.recipe_uid WHERE recipe.recipe_uid = ?"
      db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      // 查詢隨機的食譜
      let sql2 = "SELECT * FROM recipe ORDER BY RAND() LIMIT 3";
      db.query(sql2, (err2, result2) => {
        if (err2) throw err2;
        // 將食譜和推薦的食譜一起傳遞給模板
        res.render("recipe_page", { items: result, recommendations: result2 });
      });
    });
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