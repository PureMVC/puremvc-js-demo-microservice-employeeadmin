FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /service

COPY src/package*.json ./
COPY . .
EXPOSE 443

# DEVELOPMENT
ENV NODE_ENV development
RUN npm install
RUN npm install -g nodemon
CMD ["nodemon", "npm", "start"]

# PRODUCTION
#ENV NODE_ENV production
#RUN npm install --production
#RUN adduser --disabled-password myuser
#USER myuser
#CMD ["npm", "start"]