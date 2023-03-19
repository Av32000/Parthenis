const WebSocket = require("ws");

let ws
function StartServer() {
  const server = new WebSocket.Server({ port: 5000 });
  server.on("connection", function (socket) {
    ws = socket
    UpdateGrid()
  });
}

let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
let gScore = 0

function AddRandomCase(cGrid) {
  let cleared = []
  let result = clone(cGrid)

  for (let x = 0; x < cGrid.length; x++) {
    let lines = cGrid[x];
    for (let y = 0; y < lines.length; y++) {
      let value = lines[y];
      if (value == 0) cleared.push({ x: x, y: y })
    }
  }

  let selected = cleared[Math.floor(Math.random() * cleared.length)]
  result[selected.x][selected.y] = Math.random() > 0.8 ? 4 : 2
  return result
}

function getGrid() {
  return grid
}

function getScore() {
  return gScore
}

function SendRight() {
  let result = clone(grid)
  let resultTemp = clone(grid)
  let next = true
  let score = 0
  while (next) {
    let temp = clone(result)
    for (let x = 0; x < result.length; x++) {
      let lines = result[x];
      for (let y = 0; y < lines.length; y++) {
        let value = lines[y];
        if (y != 3) {
          if (result[x][y + 1] == 0) {
            movement = true
            result[x][y] = 0
            result[x][y + 1] = value
          } else if (result[x][y + 1] == value) {
            movement = true
            result[x][y] = 0
            result[x][y + 1] = value * 2
            score += value * 2
          }
        }
      }
    }
    if (equalsCheck(result, temp)) next = false
  }
  if (!equalsCheck(result, resultTemp)) result = AddRandomCase(result)
  return { grid: result, score: score }
}

function SendUp() {
  let result = clone(grid)
  let resultTemp = clone(grid)
  let next = true
  let score = 0
  while (next) {
    let temp = clone(result)
    for (let x = 0; x < result.length; x++) {
      let lines = result[x];
      for (let y = 0; y < lines.length; y++) {
        let value = lines[y];
        if (x != 0) {
          if (result[x - 1][y] == 0) {
            movement = true
            result[x][y] = 0
            result[x - 1][y] = value
          } else if (result[x - 1][y] == value) {
            movement = true
            result[x][y] = 0
            result[x - 1][y] = value * 2
            score += value * 2
          }
        }
      }
    }

    if (equalsCheck(result, temp)) next = false
  }
  if (!equalsCheck(result, resultTemp)) result = AddRandomCase(result)
  return { grid: result, score: score }
}

function SendDown() {
  let result = clone(grid)
  let resultTemp = clone(grid)
  let next = true
  let score = 0
  while (next) {
    let temp = clone(result)
    for (let x = 0; x < result.length; x++) {
      let lines = result[x];
      for (let y = 0; y < lines.length; y++) {
        let value = lines[y];
        if (x != 3) {
          if (result[x + 1][y] == 0) {
            movement = true
            result[x][y] = 0
            result[x + 1][y] = value
          } else if (result[x + 1][y] == value) {
            movement = true
            result[x][y] = 0
            result[x + 1][y] = value * 2
            score += value * 2
          }
        }
      }
    }

    if (equalsCheck(result, temp)) next = false
  }
  if (!equalsCheck(result, resultTemp)) result = AddRandomCase(result)
  return { grid: result, score: score }
}

function CheckState() {
  if (ws == null) return
  // Check Win
  let win = false;
  let loose = true;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].includes(2048)) {
      win = true;
      break;
    }
  }

  if (!equalsCheck(grid, SendRight().grid)) loose = false
  if (!equalsCheck(grid, SendLeft().grid)) loose = false
  if (!equalsCheck(grid, SendUp().grid)) loose = false
  if (!equalsCheck(grid, SendDown().grid)) loose = false

  if (win) ws.send(JSON.stringify({
    type: "Win"
  }))

  if (loose) ws.send(JSON.stringify({
    type: "Loose"
  }))
}

function SendLeft() {
  let result = clone(grid)
  let resultTemp = clone(grid)
  let next = true
  let score = 0
  while (next) {
    let temp = clone(result)
    for (let x = 0; x < result.length; x++) {
      let lines = result[x];
      for (let y = 0; y < lines.length; y++) {
        let value = lines[y];
        if (y != 0) {
          if (result[x][y - 1] == 0) {
            movement = true
            result[x][y] = 0
            result[x][y - 1] = value
          } else if (result[x][y - 1] == value) {
            movement = true
            result[x][y] = 0
            result[x][y - 1] = value * 2
            score += value * 2
          }
        }
      }
    }
    if (equalsCheck(result, temp)) next = false
  }

  if (!equalsCheck(result, resultTemp)) result = AddRandomCase(result)
  return { grid: result, score: score }
}

const equalsCheck = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
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

function AddToScore(bonus) {
  gScore += bonus
}

function UpdateGrid() {
  if (ws) {
    ws.send(JSON.stringify({
      type: "UpdateGrid",
      grid: grid,
      score: gScore
    }))
  }
}

function Save(nGrid) {
  grid = nGrid
  UpdateGrid()
  CheckState()
}

function RestartGame() {
  grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  gScore = 0
  Save(AddRandomCase(grid))
  Save(AddRandomCase(grid))
}

module.exports = {
  RestartGame,
  SendDown,
  SendLeft,
  SendRight,
  SendUp,
  Save,
  AddToScore,
  StartServer,
  getGrid,
  getScore
}