// Author(s): Xiu Jia
require("dotenv").config();

const url_question_service = process.env.URL_QUESTION_SERVICE;

const getRandomQuestion = async (category, complexity = "") => {
  const qnURL = `${url_question_service}/random/${category}/${complexity}`

  console.log("qnURL", qnURL);
  const response = await fetch(qnURL).then((response) => {
    return response.json();
  });

  console.log("response", response);
  return response;
};

const getComplexity = (user1, user2) => {
  const complexity1 = user1.complexity;
  const complexity2 = user2.complexity;

  const isAny1 = user1.isAny;
  const isAny2 = user2.isAny;

  if (isAny1 && isAny2) {
    return null;
  } else if (isAny1) {
    return complexity2;
  }

  return complexity1;
}

module.exports = {
  getRandomQuestion,
  getComplexity
};