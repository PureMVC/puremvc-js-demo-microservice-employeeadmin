FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /service

COPY package*.json ./
COPY . .

# DEVELOPMENT - Enable Volume in docker-compose.yml
#ENV NODE_ENV development
#RUN npm install
#CMD ["npx", "nodemon", "npm", "start"]

# PRODUCTION
ENV NODE_ENV production
RUN npm install --production
RUN adduser --disabled-password myuser
USER myuser
CMD ["npm", "start"]
