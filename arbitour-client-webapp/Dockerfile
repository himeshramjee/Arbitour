FROM node:alpine

WORKDIR /var/containers/arbitour/arbitour-client-webapp

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]