//第一步安裝 npm install express mysql ejs
//第二步安裝 npm install path

const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
const uploadRecipe = multer({ dest: "../img/recipe" });
const uploadProduct = multer({ dest: "../img/product" });

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

//以上都是模組設定

//首頁
app.get("/", (req, res) => {
  res.render("index");
});

//新增項目
app.get("/addRecipe", (req, res) => {
  res.render("add_recipe");
});

app.get("/addProduct", (req, res) => {
  res.render("add_product");
});

let recipeCount = 50; // 設定初始值為 50

app.post("/addRecipe", function (req, res) {
  var data = req.body; // 這裡的 req.body 包含了前端傳送過來的資料

  var sql = "INSERT INTO recipe SET ?";
  db.query(sql, data, function (err, result) {
    if (err) {
      console.error(err); // 將錯誤訊息輸出到伺服器的控制台
      res.send("新增失敗，請檢查是否所有項目皆填寫!1"); // 將錯誤訊息回傳給前端
    } else {
      res.json({ message: "食譜已成功新增！", uid: result.insertId });
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../img/recipe");
  },
  filename: function (req, file, cb) {
    recipeCount++; // 每次上傳時，計數器加 1
    cb(null, "recipe" + recipeCount + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/uploadImage", upload.single("file"), function (req, res) {
  // 處理上傳的圖片...
  res.send("圖片已成功上傳！");
});

app.post("/addIngredients", function (req, res) {
  var data = req.body; // 這裡的 req.body 包含了前端傳送過來的資料

  var sql = "INSERT INTO ingredients_for_recipe SET ?";
  db.query(sql, data, function (err, result) {
    if (err) {
      console.error(err); // 將錯誤訊息輸出到伺服器的控制台
      res.send("新增失敗，請檢查是否所有項目皆填寫!2"); // 將錯誤訊息回傳給前端
    } else {
      res.send("食材已成功新增！");
    }
  });
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
  let sql = recipe_common + " WHERE style = ?";
  db.query(sql, [style], (err, result) => {
    if (err) throw err;
    res.render("recipe", { items: result, style: style });
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
  let sql = product_common + " WHERE related = ?";
  db.query(sql, [related], (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/sales_desc", (req, res) => {
  let sql = product_common + " ORDER BY sales_amount";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/sales", (req, res) => {
  let sql = product_common + " ORDER BY sales_amount DESC";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/sales_ratio", (req, res) => {
  let sql =
    "SELECT product.*, related.related_name AS related_name, IFNULL((product.sales_amount / product.click) * 100, 0) AS sales_ratio FROM product LEFT JOIN related ON product.related = related.related_uid ORDER BY sales_ratio DESC";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("product", { items: result });
  });
});

app.get("/product/sort/sales_ratio_desc", (req, res) => {
  let sql =
    "SELECT product.*, related.related_name AS related_name, IFNULL((product.sales_amount / product.click) * 100, 0) AS sales_ratio FROM product LEFT JOIN related ON product.related = related.related_uid ORDER BY sales_ratio";
  db.query(sql, (err, result) => {
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

//搜尋系統
app.get("/search", (req, res) => {
  let table = req.query.search; // 從查詢參數中獲取要搜尋的表名
  let keyword = req.query.keyword; // 從查詢參數中獲取搜尋關鍵字

  // 根據表名決定要搜尋的欄位和 SQL 查詢
  let column, sql;
  if (table === "recipe") {
    column = "recipe_title";
    sql =
      "SELECT recipe.*, style.style_name AS style_name, related.related_name AS related_name FROM recipe LEFT JOIN style ON recipe.style = style.style_uid LEFT JOIN related ON recipe.related = related.related_uid WHERE recipe_title LIKE ? OR recipe_uid LIKE ? OR style_name LIKE ? OR related_name LIKE ?";
  } else {
    column = "product_title";
    sql =
      "SELECT product.*, related.related_name AS related_name FROM product LEFT JOIN related ON product.related = related.related_uid WHERE product_title LIKE ? OR product_uid LIKE ? OR related_name LIKE ?";
  }

  // 執行 SQL 查詢
  db.query(
    sql,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
    (err, result) => {
      if (err) throw err;

      // 根據表名決定要渲染的模板
      let template = table === "recipe" ? "recipe" : "product";

      // 渲染模板並傳遞搜尋結果
      res.render(template, { items: result });
    }
  );
});

app.use(express.static("../"));
app.use(express.static("jquery"));
app.use(express.static("CSS"));
