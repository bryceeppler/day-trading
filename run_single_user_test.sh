#!/bin/bash

docker-compose down -v
docker-compose up --build -d
python ./tests/single_user_test.py
