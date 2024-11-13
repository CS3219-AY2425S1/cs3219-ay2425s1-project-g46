const axios = require('axios');

// Base URL for the User Service
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001/user';

const signup = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/signup`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const login = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const logout = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/logout`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const getUser = async (email) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/profile/${email}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const updateAvatar = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/profile/updateavatar`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const changePassword = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/profile/changepassword`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const getHistory = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/profile/gethistory`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const addReview = async (feedbackData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/adduserreview`, feedbackData);
    return response;
  } catch (error) {
    throw error;
  }
}

const getReview = async (email) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/getuserreview/${email}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const addWebsiteFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/addwebsitefeedback`, feedbackData);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signup,
  login,
  logout,
  getUser,
  updateAvatar,
  changePassword,
  getHistory,
  addReview,
  getReview,
  addWebsiteFeedback
};