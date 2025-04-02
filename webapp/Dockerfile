FROM node:22

COPY ./src /app/src
COPY ./public /app/public
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

#Install the dependencies
RUN npm install --ignore-scripts --omit=dev

ARG API_URI="http://localhost:8000"
ENV API_ENDPOINT=$API_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install --ignore-scripts -g serve --production

# Run the app as a non-root user
USER node

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
