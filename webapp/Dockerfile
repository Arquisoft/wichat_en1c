FROM node:22

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install --omit=dev

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

ARG DOCS_URI="https://arquisoft.github.io/wichat_en1c/"
ENV REACT_APP_DOCS_ENDPOINT=$DOCS_URI

ARG REPO_URI="https://github.com/Arquisoft/wichat_en1c"
ENV REACT_APP_REPO_ENDPOINT=$REPO_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install -g serve --production

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
