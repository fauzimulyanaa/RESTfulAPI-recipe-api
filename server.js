require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const Router = require("./src/router");
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));
// secure header http
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
// data sanitization against site script xss
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    messaga: "Succeess",
    data: `Server running on port ${PORT}`,
  });
});

app.use(Router);

app.listen(PORT, () => {
  console.log(`Server success running on port ${PORT}`);
});
