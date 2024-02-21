# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

CMD ["npm", "start"]
