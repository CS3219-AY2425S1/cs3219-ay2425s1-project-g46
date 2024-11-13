// Author(s): Xiu Jia
const axios = require('axios');

require("dotenv").config();

const URL_QUESTION_SERVICE = process.env.URL_QUESTION_SERVICE;

const getRandomQuestion = async (category, complexity = "") => {
  console.log("get random question");
  const qnURL = `${URL_QUESTION_SERVICE}/random/${category}/${complexity}`

  console.log("qnURL", qnURL);
  const response = await axios.get(qnURL);

  // console.log("response", response.data);

  return response.data;
};

const getComplexity = (user1, user2) => {
  const complexity1 = user1.complexity;
  const complexity2 = user2.complexity;

  const isAny1 = user1.isAny;
  const isAny2 = user2.isAny;

  if (isAny1 && isAny2) {
    return "";
  } else if (isAny1) {
    return complexity2;
  }

  return complexity1;
}

module.exports = {
  getRandomQuestion,
  getComplexity
};