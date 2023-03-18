const express = require('express');
const Game = require('./Game')
const app = express();

app.use(require("body-parser").json())
app.use(require('cors')({
  origin: "*"
}))

app.get('/api/right', (req, res) => {
  res.send(Game.SendRight());
});

app.get('/api/down', (req, res) => {
  res.send(Game.SendDown());
});

app.get('/api/up', (req, res) => {
  res.send(Game.SendUp());
});

app.get('/api/left', (req, res) => {
  res.send(Game.SendLeft());
});

app.post('/api/save', (req, res) => {
  Game.AddToScore(req.body.score)
  Game.Save(req.body.grid)
  res.sendStatus(200);
});

app.get('/api/restart', (req, res) => {
  Game.RestartGame()
  res.sendStatus(200);
});

Game.RestartGame()

app.listen(8080, () => console.log("Server started on port 8080"));