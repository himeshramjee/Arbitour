FROM node:alpine

WORKDIR /var/containers/arbitour/arbitour-service

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]