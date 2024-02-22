docker compose down -v
docker compose up --build -d
Start-Sleep -Seconds 1
python single_user_test.py