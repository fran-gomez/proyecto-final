FROM node:22-alpine
WORKDIR /
COPY package*.json ./
RUN npm ci
COPY . .

CMD npm start
