// Author(s): Andrew, Xiu Jia
require("dotenv").config();
const admin = require("firebase-admin");

const firebaseConfig = {
  type: "service_account",
  project_id: "cs3219-d4ee1",
  private_key_id: "d9899e20a23a397cdce523437f42d50696aede61",
  private_key: process.env.PRIVATE_KEY,
  client_email: "firebase-adminsdk-hba0d@cs3219-d4ee1.iam.gserviceaccount.com",
  client_id: "106098472779235960036",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hba0d%40cs3219-d4ee1.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});
const db = admin.firestore();

module.exports = db;