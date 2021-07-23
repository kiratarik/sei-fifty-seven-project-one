// * Variables
const cells = []
const statisticsScores = []
let holdCells = []
let currentLevel = 1
let speedLevel = 0
let speedToggle = false
let downToggle = false
let gameIntervalId
let gameSpeedTime = 500
let gameOver = false
let gridWidth = 7
let holdShapeId = -1
let nextShapeId = Math.floor(Math.random() * 7)

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
  // reset cells
  cells.length = 0
  // create cells
  for (let index = 0; index < gridWidth * gridHeight; index++) {
    const cell = document.createElement('div')
    cell.style.width = (100 / gridWidth) + '%'
    cell.style.height = (100 / gridHeight) + '%'
    cells.push(cell)
    gridSelect.appendChild(cell)
  }
  
  // set size and flex-wrap
  gridSelect.style.width = (cellSize * gridWidth * 6) + 'px'
  gridSelect.style.height = (cellSize * gridHeight * 6) + 'px'
  gridSelect.style.display = 'flex'
  gridSelect.style.flexWrap = 'wrap'
}

// build 4x2 grid for Hild and Next
function buildHold(width, gridHeight, statsSelect, cellSize) {
  gridWidth = width
  buildGrid(gridHeight, statsSelect, cellSize)
  holdCells = cells
}

// Build shape key for statistics
function buildStats(width, gridHeight, statsSelect, cellSize) {
  // build grid
  gridWidth = width
  buildGrid(gridHeight, statsSelect, cellSize)
  
  // Set Shape Statistics Score display
  statisticsScores.length = 0
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

// Build Game board
function buildGame(width, height, gridSelect, cellSize) {
  // add borders
  gridWidth = width + 2
  const gridHeight = height + 2
  // Build grid
  buildGrid(gridHeight, gridSelect, cellSize)
  // set walls and floor with collision
  for (let index = 0; index < gridWidth * gridHeight; index += gridWidth) {
    cells[index].classList.add('wall')
    cells[index + gridWidth - 1].classList.add('wall')
  }
  // set ceiling without collision
  for (let index = 1; index < gridWidth - 1; index++) {
    cells[(gridWidth * gridHeight) - index - 1].classList.add('wall')
    cells[index].style.backgroundColor = 'grey'
  }

}

// Build Shapes - using nameId and Library
function buildGameShape() {
  const gameLibrary = new shapeLibrary(gridWidth)
  statisticsScores[currentShape.nameId].textContent = parseInt(statisticsScores[currentShape.nameId].textContent) + 1
  currentShape.nameString = gameLibrary.nameStrings[currentShape.nameId]
  currentShape.positionModifiers = gameLibrary.basePositions[currentShape.nameId]
  buildGamePiece()
}

// check collision before placing on game board - Hold and Next don't need this
function buildGamePiece() {
  if (checkCollision()) {
    gameOver = true
  } else {
    buildShapeColor()
  }
}

// build shape at exact location
function buildShapeColor() {
  currentShape.positionModifiers.forEach(modifier => {
    cells[currentShape.position + modifier].classList.add(currentShape.nameString)
  })
}

// delete shape at exact position current shape is at
function deleteShapeColor() {
  currentShape.positionModifiers.forEach(modifier => {
    cells[currentShape.position + modifier].classList.remove(currentShape.nameString)
  })
}

// Build new shape from Next and set new random next shape
function buildShapeRandom() {
  // create new random shape for Next
  currentShape.nameId = Math.floor(Math.random() * 7)
  let tempId = holdShapeId
  addHold('#next')

  // swap Ids around and build new shape
  holdShapeId = tempId
  tempId = nextShapeId
  nextShapeId = currentShape.nameId
  currentShape.nameId = tempId
  currentShape.position = 17
  buildGameShape()
}

// Line completeing
function checkLine() {
  const lines = []
  const completeLines = []
  // find lines based on shape position/modifiers and filter for no repeats
  currentShape.positionModifiers.forEach(modifier => {
    const line = Math.floor((currentShape.position + modifier) / gridWidth)
    const filterLines =  lines.filter(num => num === line)
    if (filterLines.length === 0) {
      lines.push(line)
    }
  })
  // check for complete lines by looking for classless cells
  for (let i = 0; i < lines.length; i++) {
    for (let index = 1; index < gridWidth; index++) {
      if (index === gridWidth - 1) {
        completeLines.push(lines[i])
      } else if (cells[(lines[i] * gridWidth) + index].className === '') { 
        index = gridWidth
      }
    }
  }
  removeLines(completeLines)
}
function removeLines(lines) {
  // Line Score
  let lineScore = parseInt(document.querySelector('#line-score').textContent)
  lineScore += lines.length
  document.querySelector('#line-score').textContent = lineScore

  // Level increase
  currentLevel = 1 + Math.floor(lineScore / 10)
  if (currentLevel >= 20) {
    currentLevel = 19
  } else if (lines.length !== 0) {
    speedLevel++
    if (speedLevel % 10 === 0) {
      speedUp()
    }
  }
  document.querySelector('#level').textContent = parseInt(currentLevel)


  // score
  let score = parseInt(document.querySelector('#score').textContent)
  switch (lines.length) {
    case 1:
      score += (40 * currentLevel)
      break
    case 2:
      score += (100 * currentLevel)
      break
    case 3:
      score += (300 * currentLevel)
      break
    case 4:
      score += (1200 * currentLevel)
      break
  }
  document.querySelector('#score').textContent = score

  // Remove lines - sort first then do highest lines first, left to right
  lines = lines.sort()
  for (let i = 0; i < lines.length; i++) {
    for (let index = 1; index < gridWidth - 1; index++) {
      for (let height = lines[i]; height > 0; height--) {
        cells[(height * gridWidth) + index].className = cells[(height * gridWidth) + index - gridWidth].className
      }
    }
  }

}

// speed up over time - linked to number of times score has increased, not to lines or level, so that spped increases more slowly if you do a lot of 4 liners
function speedUp() {
  speedToggle = true
  gameSpeedTime -= ((20 - (speedLevel / 10)) * 2)
}

// check if any of the cells have a class
function checkCollision() {
  return (currentShape.positionModifiers.filter(modifier => {
    return cells[currentShape.position + modifier].classList.length !== 0
  }).length)
}

// Falling block
function shapeFall() {
  // Delete and reposition
  deleteShapeColor()
  currentShape.position = currentShape.position + gridWidth
  // check for collision in new position
  if (!checkCollision()) {
    // build new
    buildShapeColor()
  } else {
    // move back and rebuild
    currentShape.position = currentShape.position - gridWidth
    buildShapeColor()
    // check for line completing
    checkLine()
    // new shape at top
    currentShape.position = 17
    buildShapeRandom()
  }
}

// Add shape to Hold or Next grids
function addHold(location) {
  // set shape id and DOM grid
  const holdLibrary = new shapeLibrary(4)
  holdShapeId = currentShape.nameId
  const holdShapeName = holdLibrary.nameStrings[holdShapeId]
  holdCells = document.querySelector(location).childNodes
  // clear grid
  for (let index = 0; index < 8; index++) {
    holdCells[index].className = ''
  }
  //build shape
  currentShape.position = 5
  currentShape.positionModifiers = holdLibrary.basePositions[holdShapeId]
  currentShape.positionModifiers.forEach(modifier => {
    holdCells[currentShape.position + modifier].classList.add(holdShapeName)
  })
}

// if hold button pressed
function handleHold() {
  const tempLibrary = new shapeLibrary(gridWidth)
  // If first Hold
  if (holdShapeId === -1) {
    // delete game shape and swap around position modifiers
    deleteShapeColor()
    const tempModifiers = currentShape.positionModifiers
    currentShape.positionModifiers = tempLibrary.basePositions[nextShapeId]
    
    // check collision of new shape type at location
    if (!checkCollision()) {
      // add shape to hold
      const originalPosition = currentShape.position
      addHold('#hold')
      // build new shape
      currentShape.position = originalPosition
      buildShapeRandom()
      // reposition new shape
      deleteShapeColor()
      currentShape.position = originalPosition
      buildShapeColor()
    } else {
      // undo previous delete - Hold failed
      currentShape.positionModifiers = tempModifiers
      buildShapeColor()
    }

  } else { // If not first Hold
    // delete game shape and swap around position modifiers
    const originalPosition = currentShape.position
    deleteShapeColor()
    const tempModifiers = currentShape.positionModifiers
    currentShape.positionModifiers = tempLibrary.basePositions[holdShapeId]
    
    // check collision of new shape type at location
    if (!checkCollision()) {
      // add shape to hold
      const heldShapeId = holdShapeId
      addHold('#hold')
      // swap with held shape and build new shape
      currentShape.position = originalPosition
      currentShape.nameId = heldShapeId
      statisticsScores[currentShape.nameId].textContent = parseInt(statisticsScores[currentShape.nameId].textContent) - 1
      buildGameShape()
    } else {
      // undo previous delete - Hold failed
      currentShape.positionModifiers = tempModifiers
      buildShapeColor()
    }
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
  // generate library and swap modifiers
  const gameLibrary = new shapeLibrary(gridWidth)
  const oldModifiers = currentShape.positionModifiers
  const newModifiers = []
  // compare modifiers with library entries
  for (let indexTwo = 0; indexTwo < 4; indexTwo++) {
    for (let indexOne = 0; indexOne < 4; indexOne++) {
      for (let index = 0; index < 4; index++) {
        const rotations = gameLibrary.rotationTranslations[indexOne]
        const rotation = rotations[index]
        // when match found move along library entry by one to find rotated modifier and add to new array
        if (oldModifiers[indexTwo] === rotation) {
          newModifiers.push(rotations[(index + direction + 4) % 4])
          index = 4
        }
      }
    }
  }
  // set new modifiers
  currentShape.positionModifiers = newModifiers
}

function pauseMenu() {
  // pause menu made visible
  document.querySelector('#pause-menu').style.display = 'flex'
  gameOver = true
}

// if keys pressed down
function handleKeyDown(event) {
  // Pause Menu
  if ((event.which || event.keyCode) === 27) {
    // Escape Key
    pauseMenu()
  }

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
    case 32:
      // Spacebar Key
      downToggle = true
      break
    case 88:
      // X Key
      rotateClockwise()
      break
    case 90:
      // Z Key
      rotateCounterclockwise()
      break
    case 67:
      // C Key
      handleHold()
      break
  }
}

// if keys pressed up
function handleKeyUp(event) {
  // If game is over ignore the following
  if (gameOver === true) {
    return
  }

  // look at which key unpressed
  switch (event.which || event.keyCode) {
    case 32:
      // Spacebar key
      setSpeed(gameSpeedTime)
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

function continueGame() {
  // Hide pause menu
  document.querySelector('#pause-menu').style.display = 'none'
  // start interval
  gameOver = false
  setSpeed(gameSpeedTime)
}

function newGame() {
  // Hide pause menu
  document.querySelector('#pause-menu').style.display = 'none'
  //reset everything
  resetBoard()
  // start interval
  setSpeed(gameSpeedTime)
}

// reset board
function resetBoard() {
  // reset all variables
  holdCells = []
  currentLevel = 1
  speedLevel = 0
  speedToggle = false
  downToggle = false
  gameIntervalId
  gameSpeedTime = 500
  gameOver = false
  gridWidth = 7
  holdShapeId = -1
  nextShapeId = Math.floor(Math.random() * 7)
  // reset grids
  document.querySelector('#hold').textContent = ''
  document.querySelector('#next').textContent = ''
  document.querySelector('#statistics').textContent = ''
  document.querySelector('#board').textContent = ''
  // start again
  startUp()
}

function startUp() {
  // Build grids for game at beginning
  buildHold(4, 2, document.querySelector('#hold'), 4)
  buildHold(4, 2, document.querySelector('#next'), 4)
  buildStats(7, 21, document.querySelector('#statistics'), 2.5)
  buildGame(10, 20, document.querySelector('#board'), 4)
  currentShape.position = 17
  buildShapeRandom()
}

// * Create Screen
startUp()

// * Events
window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)
document.getElementById('continue').addEventListener('click', continueGame)
document.getElementById('new-game').addEventListener('click', newGame)



// * Intervals
function setSpeed(speed) {
  // clear previous interval - only one running at a time
  clearInterval(gameIntervalId)
  gameIntervalId = setInterval(function(){
    // Times to inerupt:
    if (gameOver) { // if gameover or pause menu - stop
      clearInterval(gameIntervalId)
    } else if (speedToggle) { // if speed increased reset interval
      speedToggle = false
      setSpeed(gameSpeedTime)
    } else if (downToggle) { // as long as spacebar pressed set speed to fast
      downToggle = false
      setSpeed(100)
    }
    // move shape down
    shapeFall()
  }, speed)
}
