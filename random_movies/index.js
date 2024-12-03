const Express = require("express");
const axios = require("axios");

const movies_service_url = process.env.MOVIES_URL;
const port = process.env.PORT;

var app = Express();
app.get("/movies/grid", async (req, res) => {
  try {
    let movies = [];
    for (i = 0; i < 15; i++) {
      response = await axios.get(movies_service_url + "/movies/random");

      if (response.status != 200) {
        res
          .status(500)
          .json({
            message: "Se produjo un error al consultar las peliculas de la BD",
          })
          .end();
      }

      movies.push(response.data);
    }

    res.status(200).setHeader("Access-Control-Allow-Origin", "*").json(movies);
  } catch {
    res
      .status(500)
      .json({
        message: "Se produjo un error desconocido",
      })
      .end();
  }
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
