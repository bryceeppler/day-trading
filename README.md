# day-trading

Manually running a microservice
1. Navigate to `/ms_your_service`
2. Build the image `docker build -t ms_your_service .`
3. Run the image `docker run -p 8000:3000 ms_your_service`
4. Send a GET request to http://localhost:8000/ to verify your service is working and port forwarding

