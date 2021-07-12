FROM node:16-alpine as main
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
EXPOSE 3000
USER node
CMD ["npm", "start"]
