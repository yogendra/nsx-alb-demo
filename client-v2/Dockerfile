FROM node:16-alpine as build-client
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY client/package.json ./
COPY client/package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@4.0.3 -g --silent
COPY client/. ./
RUN npm run build

FROM node:16-alpine as main
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY --from=build-client /app/build/. client/build/
COPY server/ ./server/
EXPOSE 3000
USER node
CMD ["npm", "start"]
