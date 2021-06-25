docker build -t forum-pioutter .
docker run -d -p 8088:8088 --name app-web forum-pioutter
docker images
docker container ls