// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
const express = require("express");
const cors = require("cors");
const db = require("./firebase");
const app = express();
const port = 5000;

// import routes
const questionRoute = require("./question-service/routes/questionRoute.js");
const userRoute = require("./user-service/routes/userRoute.js"); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default API from expressJS
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// KEEP
// keep for now, can use/reference this for user input when they input answers for questions
const createText = async (inputText) => {
  const id = inputText;
  await db.collection("texts").add({ text: inputText });
};

/**
 * post /submit
 *
 * Submits text to firebase under texts collection.
 *
 * Responses:
 * - 200: Returns success message
 */
app.post("/submit/text", (req, res) => {
  const { inputText } = req.body;
  console.log("Received input:", inputText);
  res
    .status(200)
    .json({ message: `Form data received successfully: ${inputText}` });
  createText(inputText);
});
// END OF KEEP

// Routes
app.use("/question", questionRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});