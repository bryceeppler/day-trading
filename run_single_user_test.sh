#!/bin/bash

docker-compose down -v
docker-compose up --build -d
echo "Wait 5 seconds to ensure all is running"
sleep 5
python ./tests/single_user_test.py
