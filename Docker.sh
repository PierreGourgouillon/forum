docker build -t forum-pioutter .
docker run -d -p 8080:8080 --name app-web forum-pioutter
docker images
docker container ls