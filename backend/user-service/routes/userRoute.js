// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getUser,
    updateAvatar,
    changePassword,
    getHistory
} = require("../controller/userController");

const {
    addReview,
    getReview,
    addWebsiteFeedback
} = require("../controller/feedbackController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile/:email", getUser);
router.post("/profile/updateavatar", updateAvatar);
router.post("/profile/changepassword", changePassword);
router.post("/profile/gethistory", getHistory);
router.post("/adduserreview", addReview);
router.get("/getuserreview/:email", getReview);
router.post("/addwebsitefeedback", addWebsiteFeedback);

module.exports = router;