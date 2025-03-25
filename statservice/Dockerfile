# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/statservice

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts --omit=dev

# Copy the app source code to the working directory
COPY ./src ./src

# Expose the port the app runs on
EXPOSE 8002

# Run the app as a non-root user
USER node

# Define the command to run your app
CMD ["npm", "start"]
