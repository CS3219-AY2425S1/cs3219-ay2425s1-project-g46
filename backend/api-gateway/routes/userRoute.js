const express = require('express');
const {
  signup,
  login,
  logout,
  getUser,
  updateAvatar,
  changePassword,
  getHistory
} = require('../services/userService');

const userRouter = express.Router();

// Route to sign up new user
userRouter.post('/signup', async (req, res) => {
  try {
    const response = await signup(req.body);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).json({ message: error.response.data.message });
  }
});

// Route to login user
userRouter.post('/login', async (req, res) => {
  try {
    const response = await login(req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).json({ message: error.response.data.message });
  }
});

// Route to logout user
userRouter.post('/logout', async (req, res) => {
  try {
    const response = await logout(req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).json({ message: error.response.data.message });
  }
});

// Route to get user
userRouter.get('/profile/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const response = await getUser(email);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

// Route to update user's avatar
userRouter.post('/profile/updateavatar', async (req, res) => {
  try {
    const response = await updateAvatar(req.body);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

// Route to change user's password
userRouter.post('/profile/changepassword', async (req, res) => {
  try {
    const response = await changePassword(req.body);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

// Route to get user's history
userRouter.post('/profile/gethistory', async (req, res) => {
  try {
    const response = await getHistory(req.body);
    if (response.status == 204) {
      res.status(response.status).send({ message: response.data.message });
    } else if (response.status == 200) {
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

module.exports = userRouter;