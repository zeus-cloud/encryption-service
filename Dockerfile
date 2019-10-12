FROM node:10

WORKDIR /

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8083

CMD [ "node", "test.js" ]
