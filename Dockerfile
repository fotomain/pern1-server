
# backend/Dockerfile
FROM node:20-alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
# API port for local calls
EXPOSE 4000 
CMD ["node", "index.js"]

