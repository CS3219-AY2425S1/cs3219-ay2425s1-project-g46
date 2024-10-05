# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define the command to run your app
CMD ["npm", "start"]
