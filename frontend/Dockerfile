FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY index.html ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY src ./src
EXPOSE 8081
ENV PORT=8081
CMD ["npm", "run", "start"]
