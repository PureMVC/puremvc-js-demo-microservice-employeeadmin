FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /service

COPY package*.json ./
COPY . .

# DEVELOPMENT
#ENV NODE_ENV development
## Enable Volume in docker-compose.yml
#RUN npm install
#CMD ["npx", "nodemon", "npm", "start"]

# PRODUCTION
ENV NODE_ENV production
RUN npm install --production
RUN adduser --disabled-password myuser
USER myuser
CMD ["npm", "start"]
