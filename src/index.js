const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;

const recipes = require("./router/recipes");
const users = require("./router/users");
const category = require("./router/category");
const auth = require("./router/auth");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/recipe", recipes);
app.use("/user", users);
app.use("/auth", auth);
app.use("/category", category);

app.listen(port, () => {
  console.log(`Example appp listening on port ${port}`);
});
