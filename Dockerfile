FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD [ "node", "build" ]