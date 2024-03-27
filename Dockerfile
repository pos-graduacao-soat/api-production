FROM node:20-alpine3.18

WORKDIR /app

COPY prod-package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY ./src ./src
COPY ./docs ./docs
COPY ./tsconfig.json ./tsconfig.json

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
