# Use an official Node.js runtime as a parent image
FROM node:22

# COMMON - START 
# Set the working directory in the container
WORKDIR /home/node/common

# Copy package.json and package-lock.json to the working directory
COPY ./common/package*.json ./

# Install common dependencies
RUN npm install --ignore-scripts --omit=dev

# Copy common
COPY ./common/src ./src
# END

# Set the working directory in the container
WORKDIR /usr/src/gameservice

# Copy package.json and package-lock.json to the working directory
COPY ./gameservice/package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts --omit=dev

# Copy the app source code to the working directory
COPY ./gameservice/src ./src

# Expose the port the app runs on
EXPOSE 8001

# Run the app as a non-root user
USER node

# Define the command to run your app
CMD ["node", "."]