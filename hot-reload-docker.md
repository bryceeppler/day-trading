Enabling hot-reload for a docker container

1. Install `nodemon` in your service
```bash
cd ms_your_service
npm install nodemon
```

2. Navigate to `ms_your_service/package.json` and add a "dev" script that runs `nodemon index.js`
```json
  "scripts": {
    "test": "jest",
    "start": "node index.js",
    "dev": "nodemon index.js" // add this line
  }
```

3. Create a `docker-compose.override.yml` file in the root project directory.

```yml
# This can be used to override the docker-compose file for development. It does not overwrite, it merges with the original docker-compose file

# If you want to bypass the override file, use the -f flag in your docker-compose command to force the use of the default file
# Example: docker-compose -f docker-compose.yml up

version: "3.9"
services:
  # This override creates a volume to map the local directory to the container directory for live updates
  # and runs the development script to start the server (nodemon)
  ms_matching_engine:
    volumes:
      - ./ms_matching_engine:/app # mount local volume for hot reload
    command: ["npm", "run", "dev"] # override run command to use nodemon


  # This override exposes the database to host machine
  # With this you can access the database at mongodb://mongodb:mongodb@localhost:27017/ using MongoDB Compass
  mongo:
    ports:
      - "27017:27017"
```