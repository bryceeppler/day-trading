#!/bin/bash

docker-compose down -v
docker-compose up --build -d
# python single_user_test.py
