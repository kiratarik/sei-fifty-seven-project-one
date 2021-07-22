// * DOM Elements
const cells = []
const statisticsScores = []
let holdCells = []

// * Variables
const gameSpeedTime = 100
let gameOver = false
let gridWidth = 7
let gameWidth = 0
let holdShapeId = -1

// * Objects

const currentShape = {
  nameId: 0,
  nameString: 'shape-?',
  position: 0,
  positionModifiers: [0, 0, 0, 0],
}

class shapeLibrary {
  constructor(gridWidth) {
    this.nameStrings = [
      'shape-t',
      'shape-l',
      'shape-s',
      'shape-o',
      'shape-z',
      'shape-j',
      'shape-i'
    ],
    this.basePositions = [
      [0, -1, 1, -gridWidth],
      [0, -1, 1, -gridWidth + 1],
      [0, -1, -gridWidth, -gridWidth + 1],
      [0, 1, -gridWidth, -gridWidth + 1],
      [0, 1, -gridWidth, -gridWidth - 1],
      [0, -1, 1, -gridWidth - 1],
      [0, -1, 1, 2]
    ],
    this.rotationTranslations = [
      [0, 0, 0, 0],
      [-1, -gridWidth, 1, gridWidth],
      [-gridWidth - 1, -gridWidth + 1, gridWidth + 1, gridWidth - 1],
      [-2, -gridWidth * 2, 2, gridWidth * 2]
    ]
  }
}




// * Functions
// Build Grids
function buildGrid(gridHeight, gridSelect, cellSize) {
  cells.length = 0
  for (let index = 0; index < gridWidth * gridHeight; index++) {
    const cell = document.createElement('div')
    // cell.textContent = index
    cell.style.width = (100 / gridWidth) + '%'
    cell.style.height = (100 / gridHeight) + '%'
    cells.push(cell)
    gridSelect.appendChild(cell)
  }
  
  gridSelect.style.width = (cellSize * gridWidth) + 'vw'
  gridSelect.style.height = (cellSize * gridHeight) + 'vw'
  gridSelect.style.display = 'flex'
  gridSelect.style.flexWrap = 'wrap'
}
function buildHold(width, gridHeight, statsSelect, cellSize) {
  gridWidth = width
  buildGrid(gridHeight, statsSelect, cellSize)
  holdCells = cells
}
function buildStats(width, gridHeight, statsSelect, cellSize) {
  // build grid
  gridWidth = width
  buildGrid(gridHeight, statsSelect, cellSize)
  
  // Set Shape Statistics Score display
  for (let index = (gridWidth - 1); index < (gridWidth * gridHeight); index += (3 * gridWidth)) {
    statisticsScores.push(cells[index])
    cells[index].textContent = '-1'
    cells[index].classList.add('stats-number')
  }
  
  // build shapes
  for (let index = 0; index < 7; index++) {
    currentShape.position = ((((index * 3) + 2) * gridWidth) - gridWidth + 2)
    currentShape.nameId = index
    buildGameShape()
  }
  currentShape.nameString = ''
}

function buildGame(width, height, gridSelect, cellSize) {
  gridWidth = width + 2
  gameWidth = gridWidth
  const gridHeight = height + 2
  buildGrid(gridHeight, gridSelect, cellSize)
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
function buildGameShape() {
  const gameLibrary = new shapeLibrary(gridWidth)
  statisticsScores[currentShape.nameId].textContent = parseInt(statisticsScores[currentShape.nameId].textContent) + 1
  currentShape.nameString = gameLibrary.nameStrings[currentShape.nameId]
  currentShape.positionModifiers = gameLibrary.basePositions[currentShape.nameId]
  buildGamePiece()
}

function buildGamePiece() {
  if (checkCollision()) {
    gameOver = true
  } else {
    buildShapeColor()
  }
}

function buildShapeColor() {
  currentShape.positionModifiers.forEach(modifier => {
    cells[currentShape.position + modifier].classList.add(currentShape.nameString)
  })
}
function deleteShapeColor() {
  currentShape.positionModifiers.forEach(modifier => {
    cells[currentShape.position + modifier].classList.remove(currentShape.nameString)
  })
}
function buildShapeRandom() {
  currentShape.nameId = Math.floor(Math.random() * 7)
  buildGameShape()
}

function checkCollision() {
  return (currentShape.positionModifiers.filter(modifier => {
    return cells[currentShape.position + modifier].classList.length !== 0
  }).length)
}

function shapeFall() {
  deleteShapeColor()
  currentShape.position = currentShape.position + gridWidth
  if (!checkCollision()) {
    buildShapeColor()
  } else {
    currentShape.position = currentShape.position - gridWidth
    buildShapeColor()
    currentShape.position = 17
    buildShapeRandom()
  }
}

function addHold() {
  const holdLibrary = new shapeLibrary(4)
  holdShapeId = currentShape.nameId
  holdCells = document.querySelector('#hold').childNodes
  for (let index = 0; index < 8; index++) {
    holdCells[index].className = ''
  }
  currentShape.position = 5
  currentShape.positionModifiers = holdLibrary.basePositions[holdShapeId]
  currentShape.positionModifiers.forEach(modifier => {
    holdCells[currentShape.position + modifier].classList.add(currentShape.nameString)
  })
}

function handleHold() {
  if (holdShapeId === -1) {
    const originalPosition = currentShape.position
    deleteShapeColor()
    addHold()
    currentShape.position = 17
    buildShapeRandom()
  } else {
    const heldShapeId = holdShapeId
    deleteShapeColor()
    addHold()
    currentShape.position = 17
    currentShape.nameId = heldShapeId
    statisticsScores[currentShape.nameId].textContent = parseInt(statisticsScores[currentShape.nameId].textContent) - 1
    buildGameShape()
  }
}

function rotateClockwise() {
  // delete current shape colors
  deleteShapeColor()

  // make 1 clockwise rotation and check collision
  rotateCurrent(1)
  if (!checkCollision()) {
    // color it
    buildShapeColor()
  } else {
    // move it back and color it
    rotateCurrent(-1)
    buildShapeColor()
  }
}
function rotateCounterclockwise() {
  // delete current shape colors
  deleteShapeColor()

  // make 1 clockwise rotation and check collision
  rotateCurrent(-1)
  if (!checkCollision()) {
    // color it
    buildShapeColor()
  } else {
    // move it back and color it
    rotateCurrent(1)
    buildShapeColor()
  }
}

function rotateCurrent(direction) {
  const gameLibrary = new shapeLibrary(gridWidth)
  const oldModifiers = currentShape.positionModifiers
  const newModifiers = []
  for (let indexTwo = 0; indexTwo < 4; indexTwo++) {
    for (let indexOne = 0; indexOne < 4; indexOne++) {
      for (let index = 0; index < 4; index++) {
        const rotations = gameLibrary.rotationTranslations[indexOne]
        const rotation = rotations[index]
        if (oldModifiers[indexTwo] === rotation) {
          newModifiers.push(rotations[(index + direction + 4) % 4])
          index = 4
        }
      }
    }
  }
  currentShape.positionModifiers = newModifiers
}

function handleKeyDown(event) {
  // If game is over don't accept following button presses
  if (gameOver === true) {
    return
  }

  // look at which key was pressed
  switch (event.which || event.keyCode) {
    case 37:
      // Left Arrow Key
      handleLeft()
      break
    case 39:
      // Right Arrow Key
      handleRight()
      break
    case 38:
      // Up Arrow Key
      rotateClockwise()
      break
    case 40:
      // Up Arrow Key
      rotateCounterclockwise()
      break
    case 67:
      // C Key
      handleHold()
      break
  }
}

function handleLeft() {
  // delete current shape colors
  deleteShapeColor()

  // move 1 tile left and check collision
  currentShape.position--
  if (!checkCollision()) {
    // color it
    buildShapeColor()
  } else {
    // move it back and color it
    currentShape.position++
    buildShapeColor()
  }
}
function handleRight() {
  // delete current shape colors
  deleteShapeColor()

  // move 1 tile right and check collision
  currentShape.position++
  if (!checkCollision()) {
    // color it
    buildShapeColor()
  } else {
    // move it back and color it
    currentShape.position--
    buildShapeColor()
  }
}

function startUp() {
  buildHold(4, 2, document.querySelector('#hold'), 2.5)
  buildStats(7, 21, document.querySelector('#statistics'), 2.5)
  buildGame(10, 20, document.querySelector('#board'), 4)
  currentShape.position = 17
  buildShapeRandom()
}

// * Create Screen
startUp()



// * Events
window.addEventListener('keydown', handleKeyDown)



// Intervals
const gameIntervalId = setInterval(function(){
  shapeFall()
  console.log('fall')
  if (gameOver) {
    console.log('Game Over')
    clearInterval(gameIntervalId)
  }
}, gameSpeedTime)