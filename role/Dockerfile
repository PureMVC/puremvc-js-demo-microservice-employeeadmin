FROM node:alpine
WORKDIR /service

COPY package.json package.json
RUN npm install --production

COPY . .
CMD ["npm", "start"]