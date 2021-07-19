// * DOM Elements
const cells = []
const statisticsScores = []

// * Variables
const shapeTString = 'shape-t'
const shapeLString = 'shape-l'
const shapeSString = 'shape-s'
const shapeOString = 'shape-o'
const shapeZString = 'shape-z'
const shapeJString = 'shape-j'
const shapeIString = 'shape-i'
const gameSpeedTime = 100
let currentShapePosition = 0
let currentShapeString = ''
let currentPositionModifiers = []
let gameOver = false

// * Functions
// Build Grids
function buildGrid(gridWidth, gridHeight, gridSelect, cellSize) {
  cells.length = 0
  for (let index = 0; index < gridWidth * gridHeight; index++) {
    const cell = document.createElement('div')
    // cell.textContent = index
    cell.style.width = (100 / gridWidth) + '%'
    cell.style.height = (100 / gridHeight) + '%'
    cells.push(cell)
    gridSelect.appendChild(cell)
    gridSelect.style.width = (cellSize * gridWidth) + 'vw'
    gridSelect.style.height = (cellSize * gridHeight) + 'vw'
    gridSelect.style.display = 'flex'
    gridSelect.style.flexWrap = 'wrap'
  }
}

function buildStats(gridWidth, gridHeight, statsSelect, cellSize) {
  buildGrid(gridWidth, gridHeight, statsSelect, cellSize)
  for (let index = ((2 * gridWidth) - 1); index < (gridWidth * gridHeight); index += (3 * gridWidth)) {
    statisticsScores.push(cells[index])
    cells[index].textContent = '000'
    cells[index].classList.add('stats-number')
  }
  buildShapeT(gridWidth, ((((0 * 3) + 2) * gridWidth) - gridWidth + 2))
  buildShapeL(gridWidth, ((((1 * 3) + 2) * gridWidth) - gridWidth + 2))
  buildShapeS(gridWidth, ((((2 * 3) + 2) * gridWidth) - gridWidth + 2))
  buildShapeO(gridWidth, ((((3 * 3) + 2) * gridWidth) - gridWidth + 2))
  buildShapeZ(gridWidth, ((((4 * 3) + 2) * gridWidth) - gridWidth + 2))
  buildShapeJ(gridWidth, ((((5 * 3) + 2) * gridWidth) - gridWidth + 2))
  buildShapeI(gridWidth, ((((6 * 3) + 2) * gridWidth) - gridWidth + 2))
  currentShapeString = ''
}

function buildGame(gridWidth, gridHeight, gridSelect, cellSize) {
  buildGrid(gridWidth, gridHeight, gridSelect, cellSize)
  for (let index = 0; index < gridWidth * gridHeight; index += gridWidth) {
    cells[index].classList.add('wall')
    cells[index + gridWidth - 1].classList.add('wall')
  }
  for (let index = 1; index < gridWidth - 1; index++) {
    cells[(gridWidth * gridHeight) - index - 1].classList.add('wall')
    cells[index].style.backgroundColor = 'grey'
  }

}

// Build Shapes
function buildShapeT(gridWidth, position) {
  currentShapeString = shapeTString
  currentPositionModifiers = [0, -1, 1, -gridWidth]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}
function buildShapeL(gridWidth, position) {
  currentShapeString = shapeLString
  currentPositionModifiers = [0, -1, 1, -gridWidth + 1]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}
function buildShapeS(gridWidth, position) {
  currentShapeString = shapeSString
  currentPositionModifiers = [0, -1, -gridWidth, -gridWidth + 1]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}
function buildShapeO(gridWidth, position) {
  currentShapeString = shapeOString
  currentPositionModifiers = [0, 1, -gridWidth, -gridWidth + 1]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}
function buildShapeZ(gridWidth, position) {
  currentShapeString = shapeZString
  currentPositionModifiers = [0, 1, -gridWidth, -gridWidth - 1]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}
function buildShapeJ(gridWidth, position) {
  currentShapeString = shapeJString
  currentPositionModifiers = [0, -1, 1, -gridWidth - 1]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}
function buildShapeI(gridWidth, position) {
  currentShapeString = shapeIString
  currentPositionModifiers = [0, -1, 1, 2]
  gameOver = (checkCollision(position, currentPositionModifiers))
  buildShapeColor(position, currentShapeString, currentPositionModifiers)
}

function buildShapeColor(position, currentShapeString, currentPositionModifiers) {
  currentPositionModifiers.forEach(modifier => {
    cells[position + modifier].classList.add(currentShapeString)
  })
}
function deleteShapeColor(position, currentShapeString, currentPositionModifiers) {
  currentPositionModifiers.forEach(modifier => {
    cells[position + modifier].classList.remove(currentShapeString)
  })
}
function buildShapeRandom(gridWidth, position) {
  const randomShapeNum = Math.floor(Math.random() * 7)
  switch (randomShapeNum) {
    case 0:
      buildShapeT(gridWidth, position)
      break
    case 1:
      buildShapeL(gridWidth, position)
      break
    case 2:
      buildShapeS(gridWidth, position)
      break
    case 3:
      buildShapeO(gridWidth, position)
      break
    case 4:
      buildShapeZ(gridWidth, position)
      break
    case 5:
      buildShapeJ(gridWidth, position)
      break
    case 6:
      buildShapeI(gridWidth, position)
      break
  }
  currentShapePosition = position
  console.log('build Shape')
}

function checkCollision(position, currentPositionModifiers) {
  return (currentPositionModifiers.filter(modifier => {
    return cells[position + modifier].classList.length !== 0
  }).length)
}

function shapeFall(gridWidth, position) {
  deleteShapeColor(position, currentShapeString, currentPositionModifiers)
  if (!checkCollision(position + gridWidth, currentPositionModifiers)) {
    currentShapePosition = position + gridWidth
    buildShapeColor(currentShapePosition, currentShapeString, currentPositionModifiers)
  } else {
    buildShapeColor(position, currentShapeString, currentPositionModifiers)
    buildShapeRandom(gridWidth, 17)
  }

}


// * Create Screen
buildStats(7, 21, document.querySelector('#statistics'), 4)
buildGame(10 + 2, 20 + 2, document.querySelector('#board'), 4)
buildShapeRandom(12, 17)



// * Events




// Intervals
const gameIntervalId = setInterval(function(){
  shapeFall(12, currentShapePosition)
  console.log('fall')
  if (gameOver) {
    console.log('Game Over')
    clearInterval(gameIntervalId)
  }
}, gameSpeedTime)