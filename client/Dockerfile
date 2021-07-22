FROM node:16-alpine as build-frontend
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@4.0.3 -g --silent
COPY frontend/. ./
RUN npm run build

FROM node:16-alpine as backend
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY --from=build-frontend /app/build/. frontend/build/
COPY backend/ ./backend/
EXPOSE 3001
USER 1000
CMD ["npm", "start"]
