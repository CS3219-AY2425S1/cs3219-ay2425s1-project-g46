const axios = require("axios");
const db = require("../config/firebase");
const collabCollection = db.collection("collabs");

/**
 * POST /add
 *
 * Creates questions from form data and store in firebase
 *
 * Responses:
 * - 500: Server error if something goes wrong while fetching data.
 */
const submitCode = async (req, res) => {
  const { code, languageId } = req.body;

  if (typeof code !== "string" || !languageId) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const formData = {
    language_id: languageId,
    source_code: btoa(code),
  };
  const options = {
    method: "POST",
    url: process.env.REACT_APP_RAPID_API_URL,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    },
    data: formData,
  };
  axios
    .request(options)
    .then(function (response) {
      console.log("res.data", response.data);
      return res.status(200).json({ submissionId: response.data.token });
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      console.log(error);
    });
};

const getSubmissionResult = async (req, res) => {
  const submissionId = req.params.submissionId;
  const options = {
    method: "GET",
    url: process.env.REACT_APP_RAPID_API_URL + "/" + submissionId,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    },
  };
  try {
    let response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (err) {
    console.error("Error fetching submission result:", err);
    let error = err.response
      ? err.response.data
      : { message: "Internal Server Error" };
    return res.status(500).json({ error: error }); // Handle errors appropriately
  }
};

const getCollabById = async (id) => {
  try {
    console.log("get collab by id:", id);
    const collab = collabCollection.doc(id);
    const data = await collab.get();

    if (!data.exists) {
      return { status: 404, error: "Collab not found" };
    }

    return { status: 200, data: data.data() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

module.exports = { 
  submitCode, 
  getSubmissionResult,
  getCollabById
};
