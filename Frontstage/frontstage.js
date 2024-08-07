const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.listen(3001, function () {
  console.log("port 3001!");
});

app.use(
  session({
    secret: "SpiceSphere20240827",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // 如果您的網站使用 HTTPS，請將此選項設為 true
  })
);

////////////////////導覽列
app.get('/nav_bar', (req, res) => {
  const user = req.session.user;
  console.log(user); // 檢查 user 變數
  res.render('nav_bar', { user });
});

//////////////////////////////登入頁
app.get("/login", (req, res) => {
  res.render("login");
});

///////////////檢查是否已經登入(不確定有無作用)
// app.use((req, res, next) => {
//   res.locals.username = req.session.username || null;
//   next();
// });

////////////////檢查是否登入
// function isAuthenticated(req, res, next) {
//   if (req.session.user) {
//     return next();
//   } else {
//     res.redirect('/login');
//   }
// }

// 用戶資訊頁面路由
app.get("/user_page", (req, res) => {
  const user = req.session.user;
  res.render("user_page", { user });
});
//////////////主頁
app.get('/home_page', (req, res) => {
  const user = req.session.user;
  res.render('home_page', { user });
});

// 導覽列搜尋跳轉
app.post("/turning", (req, res) => {
  const select = req.body.select;
  let url;
  if (select === "recipe"){
    url = "recipe_section"
  }else if (select === "product"){
    url = "product_section"
  }else {
    url = "/"
  }
  res.json({reUrl : url})
})

///////////////食譜區
app.get("/recipe_section", (req, res) => {
  fetch("http://localhost:3000/api/recipes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      res.render("recipe_section", data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      res.status(500).send("Internal Server Error");
    });
});
///////////////食譜單頁
app.get("/recipe_section/recipe_page/:id", (req, res) => {
  fetch(`http://localhost:3000/api/recipe/${req.params.id}`)
    .then((response) => response.json())
    .then((data) => {
      res.render("recipe_page", data);
    });
});

/////////////商品區
app.get("/product_section", (req, res) => {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      res.render("product_section", data);
    });
});
//////////////商品單頁
app.get("/product_section/product_page/:id", (req, res) => {
  fetch(`http://localhost:3000/api/product/${req.params.id}`)
    .then((response) => response.json())
    .then((data) => {
      res.render("product_page", data);
    });
});
///////////////////////購物車/結帳
app.get("/payment", (req, res) => {
  res.render("payment");
});

app.use(express.static("../"));
app.use(express.static("jquery"));
app.use(express.static("CSS"));
// app.use(ensureAuthenticated);
