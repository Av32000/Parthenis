let grid = []
let score = 0

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
  document.getElementById("score").innerHTML = score
}

function Restart() {
  fetch("http://localhost:8080/api/restart")
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

document.addEventListener('keydown', function (event) {
  const key = event.key;
  switch (event.key) {
    case "ArrowLeft":
      CallMethod("left", res => {
        Save(res)
      })
      break;
    case "ArrowRight":
      CallMethod("right", res => {
        Save(res)
      })
      break;
    case "ArrowUp":
      CallMethod("up", res => {
        Save(res)
      })
      break;
    case "ArrowDown":
      CallMethod("down", res => {
        Save(res)
      })
      break;
  }
});

function Save(res) {
  fetch("http://localhost:8080/api/save", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ grid: res.grid, score: res.score })
  }).then(res => {
    return res
  })
}

function CallMethod(method, callback) {
  fetch("http://localhost:8080/api/" + method).then(res => {
    res.json().then(res => {
      callback(res)
    })
  })
}

const socket = new WebSocket("ws://localhost:5000")
socket.addEventListener("message", ev => {
  let data = JSON.parse(ev.data)
  if (data.type == "UpdateGrid") {
    grid = data.grid
    score = data.score
    UpdateGrid()
  } else if (data.type == "Win") {
    alert("You Win")
  } else if (data.type == "Loose") {
    alert("You loose")
  }
})