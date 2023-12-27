const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const recipes = require("./router/recipes");
const users = require("./router/users");
const category = require("./router/category");
const auth = require("./router/auth");
const event = require("./router/event");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use("/recipe", recipes);
app.use("/user", users);
app.use("/auth", auth);
app.use("/category", category);
app.use("/event", event);

app.listen(port, () => {
  console.log(`Example appp listening on port ${port}`);
});
