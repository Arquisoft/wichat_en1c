# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/gatewayservice

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Define environment variables for services
ARG AUTH_SERVICE_URL="http://authservice:8002"
ENV AUTH_SERVICE_URL=$AUTH_SERVICE_URL

ARG GAME_SERVICE_URL="http://gameservice:8001"
ENV GAME_SERVICE_URL=$GAME_SERVICE_URL

ARG STATS_SERVICE_URL="http://localhost:8003"
ENV STATS_SERVICE_URL=$STATS_SERVICE_URL

ARG QUESTIONS_SERVICE_URL="http://questionservice:8004"
ENV QUESTIONS_SERVICE_URL=$QUESTIONS_SERVICE_URL

# Copy the app source code to the working directory
COPY . .

EXPOSE 8000

# Define the command to run your app
CMD ["node", "gateway-service.js"]
