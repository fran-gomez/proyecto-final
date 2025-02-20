echo "Voy a inicializar la BD";
mongoimport --host=localhost:27017 --db=peliculas --collection=movies --file=/docker-entrypoint-initdb.d/movies.json;
echo "Finalizado el load de la BD";