FROM node:16-alpine

# Set the workdir in the container
WORKDIR /app

# Copy package*.json to /app in the container first for layer caching
COPY package*.json ./

RUN npm install

# Copy remaining files
COPY . .


# Make port available to the world outside this container
EXPOSE 3000

CMD ["npm", "start"]