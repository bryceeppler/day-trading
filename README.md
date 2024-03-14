# day-trading

Each microservice runs an express API in a nodejs container. All services connect to the same shared mongodb instance for now.

The frontend is contained in the `react` container, which runs nginx to serve the React app.

Starting all services via `docker-compose`
---
1. Navigate to project root directory
2. Run `docker-compose up`
3. If you want to force a rebuild of the containers, run `docker-compose up --build`


Once all containers are running via `docker-compose`, each service is exposed on 8000. You can test these each service by sending `http://localhost:8000/`.


| Port  | Service  |
|-------|---------------|
| 3000  | user interface |
| 8000  | ms_user |
| 6000  | ms_order_execution (not externally open)|
| 8000  | ms_order_creation |
| 8000  | ms_matching_engine |
| 8000  | ms_market_data |
| 8000  | ms_transaction_manager |



Running a service manually
---
1. Navigate to `/ms_your_service`
2. Build the image `docker build -t ms_your_service .`
3. Run the image `docker run -p 8000:3000 ms_your_service`
4. Send a GET request to http://localhost:8000/ to verify your service is working and port forwarding

Accessing the user interface
---
1. Wait about 1 minute after starting the all dockers.
2. Go to a browser and go to http://localhost:3000/
3. Login or create a user


