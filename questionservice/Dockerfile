# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/questionservice

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --ignore-scripts --omit=dev

# Copy the app source code to the working directory
COPY ./llm-service.js ./ 
# TODO: Maybe move the src files to a src folder

# Expose the port the app runs on
EXPOSE 8004

# Run the app as a non-root user
USER node

# Define the command to run your app
CMD ["npm", "start"]
