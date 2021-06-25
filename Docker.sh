echo "Build de l'image Docker"
docker build -t forum-pioutter .
echo "Le Build est terminé"

echo "Run de l'image Docker sur le port 8088"
docker run -d -p 8088:8088 --name app-web forum-pioutter
echo "L'image Docker est lancée"

echo "Liste des images Docker"
docker images

echo

echo "Liste des container Docker"
docker container ls