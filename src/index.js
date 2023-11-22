const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const recipes = require("./router/recipes");
const users = require("./router/users");
const category = require("./router/category");
const auth = require("./router/auth");

const corsOptions = {
  origin: 'http://localhost:5173', // replace with your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));



app.use(express.json());
app.use("/recipe", recipes);
app.use("/user", users);
app.use("/auth", auth);
app.use("/category", category);

app.listen(port, () => {
  console.log(`Example appp listening on port ${port}`);
});
