These scripts are copied into the mongo db instance in the docker-compose file. They are run ONCE when the container volume mounts. This data persists with container rebuilds and can be removed with `docker-compose down -v` to force remove volumes.

Use them to populate your database with test data.