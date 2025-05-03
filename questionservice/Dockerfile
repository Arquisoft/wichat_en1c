# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /home/node/common

# Copy package.json and package-lock.json to the working directory
COPY ./common/package*.json ./

# Install common dependencies
RUN npm install --ignore-scripts --omit=dev

# Copy common
COPY ./common/src ./src

# Set the working directory in the container
WORKDIR /home/node/service

# Copy package.json and package-lock.json to the working directory
COPY ./questionservice/package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts --omit=dev

# Copy the app source code to the working directory
COPY ./questionservice/src ./src 

# Run the app as a non-root user
USER node

# Define the command to run your app
CMD ["node", "."]
