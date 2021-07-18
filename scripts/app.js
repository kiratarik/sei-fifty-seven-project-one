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

// * Functions
// Build Grids
function buildGrid(gridWidth, gridHeight, gridSelect, gridSize) {
  cells.length = 0
  for (let index = 0; index < gridWidth * gridHeight; index++) {
    const cell = document.createElement('div')
    // cell.textContent = index
    cell.style.width = (100 / gridWidth) + '%'
    cell.style.height = (100 / gridHeight) + '%'
    cells.push(cell)
    gridSelect.appendChild(cell)
    gridSelect.style.width = (gridSize * gridWidth) + 'vw'
    gridSelect.style.height = (gridSize * gridHeight) + 'vw'
    gridSelect.style.display = 'flex'
    gridSelect.style.flexWrap = 'wrap'
  }
}

function buildStats(gridWidth, gridHeight, statsSelect, gridSize) {
  buildGrid(gridWidth, gridHeight, statsSelect, gridSize)
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
}

// Build Shapes
function buildShapeT(gridWidth, position) {
  cells[position].classList.add(shapeTString)
  cells[position - 1].classList.add(shapeTString)
  cells[position + 1].classList.add(shapeTString)
  cells[position - gridWidth].classList.add(shapeTString)
}
function buildShapeL(gridWidth, position) {
  cells[position].classList.add(shapeLString)
  cells[position - 1].classList.add(shapeLString)
  cells[position + 1].classList.add(shapeLString)
  cells[position - gridWidth + 1].classList.add(shapeLString)
}
function buildShapeS(gridWidth, position) {
  cells[position].classList.add(shapeSString)
  cells[position - 1].classList.add(shapeSString)
  cells[position - gridWidth].classList.add(shapeSString)
  cells[position - gridWidth + 1].classList.add(shapeSString)
}
function buildShapeO(gridWidth, position) {
  cells[position].classList.add(shapeOString)
  cells[position + 1].classList.add(shapeOString)
  cells[position - gridWidth].classList.add(shapeOString)
  cells[position - gridWidth + 1].classList.add(shapeOString)
}
function buildShapeZ(gridWidth, position) {
  cells[position].classList.add(shapeZString)
  cells[position + 1].classList.add(shapeZString)
  cells[position - gridWidth].classList.add(shapeZString)
  cells[position - gridWidth - 1].classList.add(shapeZString)
}
function buildShapeJ(gridWidth, position) {
  cells[position].classList.add(shapeJString)
  cells[position - 1].classList.add(shapeJString)
  cells[position + 1].classList.add(shapeJString)
  cells[position - gridWidth - 1].classList.add(shapeJString)
}
function buildShapeI(gridWidth, position) {
  cells[position].classList.add(shapeIString)
  cells[position - 1].classList.add(shapeIString)
  cells[position + 1].classList.add(shapeIString)
  cells[position + 2].classList.add(shapeIString)
}


// * Create Screen
buildStats(7, 21, document.querySelector('#statistics'), 4)
buildGrid(10, 20, document.querySelector('#board'), 5)


// * Events


