FROM node:22

WORKDIR /app

COPY package.json ./
RUN npm install

COPY server.js db.js upload.js ./
RUN mkdir -p uploads

CMD ["npm", "start"]
