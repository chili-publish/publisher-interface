FROM node:18

WORKDIR /usr/app

COPY package*.json ./

RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev libcups2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libwayland-client0

RUN npm install


