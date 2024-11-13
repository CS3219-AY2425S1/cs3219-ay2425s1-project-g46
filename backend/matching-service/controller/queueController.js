// Author(s): Andrew, Xinyi
const connectToRabbitMQ = require("../config/rabbitMQ");

async function addUserToQueue(topic, difficultyLevel, email, token, username, isAny) {

  let queueKey = topic + " " + difficultyLevel;

  if (isAny) {
    queueKey = topic + " " + "any";

  }

  const message = {
    "email": email,
    "token": token,
    "username": username,
    "topic": topic,
    "difficultyLevel": difficultyLevel,
    "isAny": isAny
  };

  try {

    const queuePriorityKey = topic + " priority";
    const { conn, channel } = await connectToRabbitMQ();
    let res = await channel.assertQueue(queueKey);
    await channel.assertQueue(queuePriorityKey);
    await channel.assertQueue(`${topic} any`); // Ensure that there is alawys "any" queue

    await channel.sendToQueue(queueKey, Buffer.from(JSON.stringify(message)), {
      expiration: `60000` // Timer for TTL
    });
    console.log(`Queue Status: Message sent to queue ${queueKey}`);
    res = await channel.assertQueue(queueKey);
    console.log(`Queue Status: ${queueKey} currently has ${res.messageCount} users`);


    await channel.sendToQueue(queuePriorityKey, Buffer.from(JSON.stringify(message)), {
      expiration: `60000` // Timer for TTL
    });
    console.log(`Queue Status: Message sent to queue ${queuePriorityKey}`);

    // Close the channel and connection after processing
    await channel.close();
    await conn.close();

  } catch (err) {
    console.error(`Error -> ${err}`);
  }
}


async function checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny) {

  let queueKey = topic + " " + difficultyLevel;

  if (isAny) {
    queueKey = topic + " " + "any";

  }

  try {
    const { conn, channel } = await connectToRabbitMQ();
    const res = await channel.assertQueue(queueKey);

    const queueAnyKey = `${topic} any`;
    const queueAnyStatus = await channel.checkQueue(queueAnyKey);

    let queueStatus = await channel.checkQueue(queueKey);
    // console.log(`${queueKey} currently has ${queueStatus.messageCount} users`);
    if (queueStatus.messageCount >= 2 || (queueStatus.messageCount >= 1 && queueAnyStatus.messageCount >= 1)) {

      const firstUser = await channel.get(queueKey, { noAck: false });
      if (!firstUser) {
        console.error("Queue Status: Failed to retrieve the first user.");
        return;
      }

      let secondUser = await channel.get(queueKey, { noAck: false });
      if (!secondUser) {
        console.error("Queue Status: Failed to retrieve the second user.");
        console.log("Queue Status: Now checking on the 'any' queue");
        const queueAnyStatus = await channel.checkQueue(queueAnyKey);
        if (queueAnyStatus.messageCount > 0) {
          secondUser = await channel.get(queueAnyKey, { noAck: false });
          if (!secondUser) {
            console.error("Queue Status: Failed to retrieve the second user from 'any' queue.")
            channel.nack(firstUser, false, true); //Requeue the first user
            return;
          }
        }

      }

      const userList = [];

      const firstUserData = JSON.parse(firstUser.content.toString());
      const secondUserData = JSON.parse(secondUser.content.toString());

      userList.push(firstUserData);
      userList.push(secondUserData);

      channel.ack(firstUser);
      channel.ack(secondUser);
      console.log(`A match is found: --> User1: ${firstUserData.email}  --> User2: ${secondUserData.email}`);

      queueStatus = await channel.checkQueue(queueKey);
      console.log(`Queue Status: ${queueKey} currently has ${queueStatus.messageCount} users`);

      return userList;

    }

    return null;
  } catch (err) {
    console.error(`Error -> ${err}`);
  }
}

async function checkMatchingAnyQueue(topic, difficultyLevel, email, token, isAny) {
  try {

    const queuePriorityKey = topic + " priority";
    while (true) {
      const { conn, channel } = await connectToRabbitMQ();
      const res = await channel.assertQueue(queuePriorityKey);

      const queuePriorityStatus = await channel.checkQueue(queuePriorityKey);
      if (queuePriorityStatus.messageCount > 0) {
        const userInPriorityQueue = await channel.get(queuePriorityKey, { noAck: false });
        if (!userInPriorityQueue) {
          console.error("Queue Status: Failed to retrieve the first user.");
          return;
        }

        const userInPriorityQueueData = JSON.parse(userInPriorityQueue.content.toString());

        // console.log(`Current email: ${email}   PriorityQueueUser: ${userInPriorityQueueData.email}`);
        if (userInPriorityQueueData.email === email) {
          channel.nack(userInPriorityQueue, false, true);
          return null;
        }

        channel.ack(userInPriorityQueue);

        let queueKey = "";
        if (userInPriorityQueueData.isAny) {
          queueKey = `${userInPriorityQueueData.topic} any`;
        } else {
          queueKey = `${userInPriorityQueueData.topic} ${userInPriorityQueueData.difficultyLevel}`;
        }

        const chosenUser = await channel.get(queueKey, { noAck: false });
        if (!chosenUser || !chosenUser.content) {
          continue;
        } else if (JSON.parse(chosenUser.content.toString()).email != userInPriorityQueueData.email) {
          channel.nack(chosenUser, false, true);
          continue;
        }

        // console.log("Found the user");

        await channel.assertQueue(topic + " any");
        const secondUser = await channel.get((topic + " any"), { noAck: false });
        if (!secondUser || !secondUser.content) {
          console.error("Queue Status: Failed to retrieve the second user.");
          channel.nack(chosenUser, false, true);
          return;
        }

        const userList = [];
        const chosenUserData = JSON.parse(chosenUser.content.toString());
        const secondUserData = JSON.parse(secondUser.content.toString());

        userList.push(chosenUserData);
        userList.push(secondUserData);

        channel.ack(chosenUser);
        channel.ack(secondUser);
        const queueStatus1 = await channel.assertQueue(queueKey);
        const queueStatus2 = await channel.assertQueue(topic + " any");
        console.log(`A match is found: --> User1: ${chosenUserData.email}  --> User2: ${secondUserData.email}`);
        console.log(`Queue Status: ${queueKey} currently has ${queueStatus1.messageCount} users`);
        console.log(`Queue Status: ${topic + " any"} currently has ${queueStatus2.messageCount} users`)

        return userList;

      } else {
        break;
      }

    }

    return null;
  } catch (err) {
    console.error(`Error -> ${err}`);
  }
}

async function removeUserFromQueue(topic, difficultyLevel, email, token, username, isAny) {
  let queueKey = topic + " " + difficultyLevel;
  if (isAny) {
    queueKey = topic + " any";
  }

  try {
    const { conn, channel } = await connectToRabbitMQ();
    const res = await channel.assertQueue(queueKey);

    let queueStatus = await channel.checkQueue(queueKey);
    // there should be only 1 person in queue
    // if > 2 people in queue, will be instantly matched
    if (queueStatus.messageCount < 2) {
      const user = await channel.get(queueKey, { noAck: false });
      if (!user) {
        console.error("Queue Status: No user in queue.");
        return;
      }

      const userData = JSON.parse(user.content.toString());
      channel.ack(user);
      queueStatus = await channel.checkQueue(queueKey);
      console.log(`Queue Status: ${queueKey} currently has ${queueStatus.messageCount} users`);

      // Close the channel and connection after processing
      await channel.close();
      await conn.close();

      // return user data
      return userData;
    }
  } catch (error) {
    console.error(`Queue Status: Failed to remove user from queue ${queueKey}:`, error)
  }
}


async function removeUserFromPriorityQueue(topic, difficultyLevel, email, token, username, isAny) {
  const queueKey = topic + " priority";

  try {
    const { conn, channel } = await connectToRabbitMQ();
    const res = await channel.assertQueue(queueKey);

    let found = false;

    // Loop through the queue messages
    while (!found) {
      const message = await channel.get(queueKey, { noAck: false });

      if (message) {
        let user = JSON.parse(message.content.toString());
        // console.log(`useremail: ${user.email}     email: ${email}`);

        if (user.email === email) {
          // console.log("Correct user found. Removing from queue.");
          channel.ack(message);  // Acknowledge (remove) the message from the queue
          found = true;
        } else {
          // console.log("Incorrect user. Requeuing the message.");
          channel.nack(message, false, true);  // Requeue the message to keep it in the queue
        }

      } else {
        console.log("Queue Status: No user in the queue.");
        break;
      }
    }

    // Close the channel and connection after processing
    await channel.close();
    await conn.close();

  } catch (error) {
    console.error(`Failed to remove user from queue ${queueKey}:`, error);
  }
}


// Export match functions
module.exports = {
  addUserToQueue,
  checkMatchingSameQueue,
  checkMatchingAnyQueue,
  removeUserFromQueue,
  removeUserFromPriorityQueue
};
