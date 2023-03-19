const Game = require("./Game")
const progressBar = require("progress-bar-cli");

const options = {
  retry: true,
  tryCount: 1000,
  verbose: false,
  mps: 0
}

const weight = {
  score: 2,
  blank: 4
}

let scores = []
let wins = 0

if (options.mps > 0) Game.StartServer()
Game.RestartGame()

function Play() {
  // Generate all possible moves
  let movements = []
  if (!equalsCheck(Game.getGrid(), Game.SendRight().grid)) movements.push({ move: "Right", score: CalculateBoardScore(Game.SendRight()) })
  if (!equalsCheck(Game.getGrid(), Game.SendLeft().grid)) movements.push({ move: "Left", score: CalculateBoardScore(Game.SendLeft()) })
  if (!equalsCheck(Game.getGrid(), Game.SendUp().grid)) movements.push({ move: "Up", score: CalculateBoardScore(Game.SendUp()) })
  if (!equalsCheck(Game.getGrid(), Game.SendDown().grid)) movements.push({ move: "Down", score: CalculateBoardScore(Game.SendDown()) })

  // Play Best Move
  if (movements.length === 0) {
    if (options.retry) {
      scores.push(Game.getScore())
    }
    return
  }
  let bestMove = movements.reduce((prev, current) => {
    return (prev.score > current.score) ? prev : current
  });

  if (options.verbose) console.log(bestMove.move)

  let move
  switch (bestMove.move) {
    case "Right":
      move = Game.SendRight()
      if (options.verbose) console.log("(" + CalculateBoardScore(Game.SendRight()) + ")");
      Game.AddToScore(move.score)
      Game.Save(move.grid)
      break;
    case "Left":
      move = Game.SendLeft()
      if (options.verbose) console.log("(" + CalculateBoardScore(Game.SendLeft()) + ")");
      Game.AddToScore(move.score)
      Game.Save(move.grid)
      break;
    case "Up":
      move = Game.SendUp()
      if (options.verbose) console.log("(" + CalculateBoardScore(Game.SendUp()) + ")");
      Game.AddToScore(move.score)
      Game.Save(move.grid)
      break;
    case "Down":
      move = Game.SendDown()
      if (options.verbose) console.log("(" + CalculateBoardScore(Game.SendDown()) + ")");
      Game.AddToScore(move.score)
      Game.Save(move.grid)
      break;
  }

  if (CheckWin()) {
    if (verbose) console.log("I Win !!!");
    wins++
    return
  }

  // Wait
  if (options.mps > 0) {
    setTimeout(() => {
      Play()
    }, 1000 / options.mps)
  } else {
    Play()
  }
}

function CalculateBoardScore(board) {
  let result = 0

  result += board.score * weight.score
  result += GetBlankCases(board.grid) * weight.blank

  return result
}

function GetBlankCases(grid) {
  let result = 0
  for (let x = 0; x < grid.length; x++) {
    const lines = grid[x];
    for (let y = 0; y < lines.length; y++) {
      const value = lines[y];
      if (value === 0) result++
    }
  }

  return result
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;

  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function equalsCheck(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function CheckWin() {
  let win = false
  let grid = Game.getGrid()
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].includes(2048)) {
      win = true;
      break;
    }
  }

  return win
}

if (options.retry) {
  let startTime = new Date();
  for (let index = 0; index < options.tryCount; index++) {
    Game.RestartGame()
    Play()
    progressBar.progressBar(index, options.tryCount, startTime);
  }

  let average
  let median
  let max = Math.max(...scores);
  let min = Math.min(...scores);

  // Calculation of the average
  let sum = scores.reduce((total, num) => {
    return total + num;
  });

  average = sum / scores.length;

  // Calculation of the median
  if (scores.length % 2 === 0) {
    median = (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2;
  } else {
    median = scores[Math.floor(scores.length / 2)];
  }

  console.log("Average : " + average)
  console.log("Median : " + median)
  console.log("Min : " + min)
  console.log("Max : " + max)
  console.log("Wins : " + wins)
} else {
  Play()
}