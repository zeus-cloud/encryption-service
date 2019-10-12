FROM node:10

WORKDIR /usr/src/app

RUN npm install

COPY . .

EXPOSE 8083

CMD [ "node", "test.js" ]
