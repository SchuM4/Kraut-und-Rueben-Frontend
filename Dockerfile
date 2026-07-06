#Node LTS, alpine for a smaller image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://artifactory.novomind.com/artifactory/api/npm/novomind-virtual-npm/

RUN npm login --auth-type=web

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
