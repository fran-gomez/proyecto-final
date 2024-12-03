import sys
from os import environ
import json
import random
import requests
from flask import Flask

app = Flask(__name__)

@app.route('/recomendation', methods = ['GET'])
def recomend_movie():

    detailed_movies = []

    genres = []
    directors = []
    cast = []

    response = requests.get("http://history:3002/movies/history")
    if response.status_code != 200 :
        json_response = []
    else:
        json_response = response.json()

    for movie in json_response:
        response = requests.get(f"http://movies:3000/movies/{movie["_id"]}")
        json_response = response.json()

        detailed_movies.append(json_response)

        cast += (json_response["cast"] if "cast" in json_response else [])
        genres += (json_response["genres"] if "genres" in json_response else [])
        directors += (json_response["directors"] if "directors" in json_response else [])

    castCount = dict.fromkeys(cast)
    for key in dict.keys(castCount):
        castCount[key] = cast.count(key)
    
    genresCount = dict.fromkeys(genres)
    for key in dict.keys(genresCount):
        genresCount[key] = genres.count(key)

    directorsCount = dict.fromkeys(directors)
    for key in dict.keys(directorsCount):
        directorsCount[key] = directors.count(key)

    # Hacemos una busqueda medio random por director, cast o genero
    # en caso de que no haya ningun dato registrado en el criterio
    # decidido, buscamos una pelicula cualquiera, sino buscamos una
    # aleatoria del elemento mas recurrente del listado
    index = random.randint(0, 2)
    if index == 0:
        if len(castCount.items()) == 0:
            route = "/movies/random"
        else:
            highestCount = max(castCount, key=castCount.get)
            route = f"/movies/random/cast/{highestCount}"
    elif index == 1:
        if len(genresCount.items()) == 0:
            route = "/movies/random"
        else:
            highestCount = max(genresCount, key=genresCount.get)
            route = f"/movies/random/genre/{highestCount}"
    else:
        if len(directorsCount.items()) == 0:
            route = "/movies/random"
        else:
            highestCount = max(directorsCount, key=directorsCount.get)
            route = f"/movies/random/directors/{highestCount}"

    # print(route, file=sys.stderr)
    response = requests.get(f"http://movies:3000{route}")
    return app.response_class(
        response=response,
        headers={
            "Access-Control-Allow-Origin": "*"
        },
        status=200,
        mimetype='application/json'
    )


if __name__ == "__main__":
    port = environ['PORT']
    app.run(debug=True, port=port, host='0.0.0.0')