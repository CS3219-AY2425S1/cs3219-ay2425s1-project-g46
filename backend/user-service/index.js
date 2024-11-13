// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

// import routes
const userRoute = require("./routes/userRoute.js"); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default API from expressJS
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Routes
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});