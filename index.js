let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

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

function SendRight() {
  let result = clone(grid)
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

  return { grid: result, score: score }
}

function SendUp() {
  let result = clone(grid)
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

  return { grid: result, score: score }
}

function SendDown() {
  let result = clone(grid)
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

  return { grid: result, score: score }
}

function SendLeft() {
  let result = clone(grid)
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
  return { grid: result, score: score }
}

function UpdateGrid() {
  const element = document.getElementById("grid")
  element.innerHTML = null

  for (let x = 0; x < grid.length; x++) {
    const lines = grid[x];
    let line = document.createElement("div")
    line.classList.add("line")
    element.appendChild(line)
    for (let y = 0; y < lines.length; y++) {
      const value = lines[y];
      let number = document.createElement("p")
      number.innerHTML = value
      number.classList.add("number")
      number.classList.add(getValueString(value))
      line.appendChild(number)
    }
  }
}

function getValueString(value) {
  switch (value) {
    case 0:
      return "zero"
    case 2:
      return "two"
    case 4:
      return "four"
    case 8:
      return "height"
    case 16:
      return "sixteen"
    case 32:
      return "thirty-two"
    case 64:
      return "sixty-four"
    case 128:
      return "one-hundred-twenty-eight"
    case 256:
      return "two-hundred-fifty-six"
    case 512:
      return "five-hundred-twelve"
    case 1024:
      return "one-thousand-twenty-four"
    case 2048:
      return "two-thousand-four-hundred-eight"
  }
}

function Save(nGrid) {
  grid = nGrid
  UpdateGrid()
}

function RestartGame() {
  grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  Save(AddRandomCase(grid))
  Save(AddRandomCase(grid))
}

document.addEventListener('keydown', function (event) {
  const key = event.key;
  let temp = clone(grid)
  let result
  switch (event.key) {
    case "ArrowLeft":
      result = SendLeft()
      Save(result.grid)
      AddToScore(result.score)
      break;
    case "ArrowRight":
      result = SendRight()
      Save(result.grid)
      AddToScore(result.score)
      break;
    case "ArrowUp":
      result = SendUp()
      Save(result.grid)
      AddToScore(result.score)
      break;
    case "ArrowDown":
      result = SendDown()
      Save(result.grid)
      AddToScore(result.score)
      break;
  }
  if (!equalsCheck(grid, temp)) Save(AddRandomCase(grid))
});

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
  let score = parseInt(document.getElementById("score").innerHTML)
  document.getElementById("score").innerHTML = score + bonus
}

RestartGame()
