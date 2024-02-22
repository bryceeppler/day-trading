FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy dependencies to workdir
COPY package*.json ./

RUN npm install

COPY . .

# build the react app
# RUN npm run build

# serve with nginx
#FROM nginx:alpine

# copy build files to nginx
# COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

# Start nginx

