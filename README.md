# day-trading

Starting all services via `docker-compose`
---
1. Navigate to project root directory
2. Run `docker-compose up`
3. If you want to force a rebuild of the containers, run `docker-compose up --build`


Once all containers are running via `docker-compose`, each service is exposed on a specified port. You can test these each service by sending `[GET] http://localhost:<PORT>/`.


| Port  | Service  |
|-------|---------------|
| 8001  | ms_user |
| 8002  | ms_order_execution |
| 8003  | ms_order_creation |
| 8004  | ms_matching_engine |
| 8005  | ms_market_data |



Running a service manually
---
1. Navigate to `/ms_your_service`
2. Build the image `docker build -t ms_your_service .`
3. Run the image `docker run -p 8000:3000 ms_your_service`
4. Send a GET request to http://localhost:8000/ to verify your service is working and port forwarding

