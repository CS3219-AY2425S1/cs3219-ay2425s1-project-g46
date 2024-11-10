// Author(s): Andrew, Xinyi
const db = require("../db/firebase");
const userReviewCollection = db.collection("userReviews");
const transporter = require("../config/nodemailer");


// For user feedback
const addReview = async (req, res) => {
  try {
    const { otherUserEmail, newReview } = req.body;

    const now = new Date();
    now.setHours(now.getHours() + 8); // Adjust to UTC+8

    const reviewWithTimestamp = {
      ...newReview,
      timestamp: now.toISOString(),
    };

    const userRef = userReviewCollection.doc(otherUserEmail);

    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({ 1: reviewWithTimestamp });
    } else {
      const reviews = doc.data();
      const reviewKeys = Object.keys(reviews).map(Number);
      let maxKey = Math.max(...reviewKeys);
      if (maxKey === -Infinity) {
        maxKey = 0;
      }
      await userRef.update({ [maxKey + 1]: reviewWithTimestamp });
    }

    const historyRef = db.collection("historyIndividual").doc(newReview.by);
    const historyDoc = await historyRef.get();

    roomId = newReview.roomId;

    if (historyDoc.exists && historyDoc.data()[roomId]) {
      await historyRef.update({
        [`${roomId}.reviewGiven`]: true,
      });
      console.log(`reviewGiven updated to true for email: ${newReview.email}, roomId: ${roomId}`);
    } else {
      console.log(`No history entry found for roomId ${roomId}`);
    }

    console.log(`Review added to ${otherUserEmail} successfully`);
    res.status(200).send({ message: `Review added to ${otherUserEmail} successfully` });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: error.message });
  }
}


const getReview = async (req, res) => {
  const userEmail = req.params.email;
  console.log("Feteching user review based on the email: ", userEmail)
  try {

    const reviewCollection = db.collection("userReviews");
    const usersRef = reviewCollection.doc(userEmail);
    const getReviews = await usersRef.get();

    if (!getReviews.exists) {
      console.log("User review not found. Creating an empty document.");
      await usersRef.set({});
      return res.status(204).send({ message: "User review not found. Created a placeholder document with no data." });
    }

    const userData = getReviews.data();
    console.log("Fetched user review data: ", userData);
    return res.status(200).send(userData)

  } catch (error) {
    console.error("Error fetching user data: ", error);
    return res.status(500).send({ error: error.message });
  }
}


// For website feedback
const addWebsiteFeedback = async (req, res) => {
  let feedbackContent = req.body.feedbackContent.comment;
  console.log("Fetching website feedback: ", req.body.feedbackContent);

  const sender = req.body.feedbackContent.email;
  feedbackContent += `\nFrom: ${sender}`;

  const mailOptions = {
    from: {
      name: `"CS3219 PeerPrep Program`,
      address: req.body.feedbackContent.email,
    },
    to: [process.env.EMAIL_USER],
    subject: "Website Feedback",
    text: feedbackContent || "No feedback provided",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Feedback email has been sent");
    res.status(200).send({ message: "Feedback sent successfully" });
  } catch (error) {
    console.error("Failed to send feedback:", error);
    res.status(500).send({ error: "Failed to send feedback" });
  }
};




// Export user functions
module.exports = {
  addReview,
  getReview,
  addWebsiteFeedback
};
