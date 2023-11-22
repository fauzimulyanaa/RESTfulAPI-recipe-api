const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors")
const recipes = require("./router/recipes");
const users = require("./router/users");
const category = require("./router/category");
const auth = require("./router/auth");

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: 'Content-Type, Authorization', // Add any other headers you need
};

app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: false }));



app.use(express.json());
app.use("/recipe", recipes);
app.use("/user", users);
app.use("/auth", auth);
app.use("/category", category);

app.listen(port, () => {
  console.log(`Example appp listening on port ${port}`);
});
