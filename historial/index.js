const Express = require("express");

var app = Express();
var amqp = require("amqplib/callback_api");
const port = process.env.PORT ?? 3000;
const queueName = "search_history";

app.use(Express.json());

app.post("/movies/history", (req, res) => {
  amqp.connect("amqp://queue_worker", function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queueName, {
        durable: true,
      });

      let data = req.body;
      var msg = JSON.stringify({
        _id: data.id,
        title: data.title,
      });

      channel.sendToQueue(queueName, Buffer.from(msg));
    });
  });

  res.setHeader("Access-Control-Allow-Origin", "*").status(200).send();
});

// Con esta ruta evitamos que el CORS del navegador nos bloquee todo
// en un entorno donde desde el puerto 80 interactuamos con otro distinto
app.options("/movies/history", async (req, res) => {
  res
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "*")
    .status(200)
    .json({ result: true });
});

app.get("/movies/history", (req, res) => {
  let movies = [];
  let messageCount = 0;
  let messageCounter = 0;

  amqp.connect("amqp://queue_worker", function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(
        queueName,
        {
          durable: true,
        },
        (error2, result) => {
          if (error2) {
            console.log("No existe la queue?");
            throw error2;
          }

          messageCount = result.messageCount;
          if (messageCount <= 0) {
            channel.close();
            res.status(200).json(movies);
            return;
          }

          channel.consume(
            queueName,
            function (msg) {
              let movie = JSON.parse(msg.content);
              movies.push(movie);

              if (messageCount === ++messageCounter) {
                channel.close();
                res.status(200).json(movies);
              }
            },
            {
              noAck: false,
            }
          );
        }
      );
    });
  });
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
