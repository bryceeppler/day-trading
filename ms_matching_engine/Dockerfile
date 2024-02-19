FROM node:16-alpine as build

# Set the workdir in the container
WORKDIR /app

# Copy package*.json to /app in the container first for layer caching
COPY package*.json ./

RUN npm install

# Copy remaining files
COPY . .

RUN npm run build

# debugging
RUN ls -la /app


# Now we can run the compiled js
FROM node:16-alpine as run

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]