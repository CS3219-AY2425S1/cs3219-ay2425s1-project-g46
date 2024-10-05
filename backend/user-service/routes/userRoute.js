// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout
} = require("../controller/userController");

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;