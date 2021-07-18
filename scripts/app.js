// * DOM Elements


// * Variables


// * Functions
function buildGrid(gridWidth, gridHeight, gridSelect, gridSize) {
  const cells = []
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

function buildStats(statsSelect, gridSize) {
  buildGrid(6, 21, statsSelect, gridSize)
  for (let index = 0; index < 7; index++) {
    const statsNumId = (index * 18) + 12
    const statsNum = statsSelect.querySelector(String(`div:nth-child(${statsNumId})`))
    statsNum.textContent = '000'
    statsNum.classList.add('stats-number')
    statsNum.style.boxShadow = '0px 0px 2px black'
  }
  const statsNums = document.querySelectorAll('.stats-number')
  console.log(statsNums)
  statsNums[0].id = 'stats-t'
  statsNums[1].id = 'stats-s'
  statsNums[2].id = 'stats-l'
  statsNums[3].id = 'stats-o'
  statsNums[4].id = 'stats-j'
  statsNums[5].id = 'stats-z'
  statsNums[6].id = 'stats-i'
}

// * Create Screen
buildStats(document.querySelector('#statistics'), 4)
buildGrid(10, 20, document.querySelector('#board'), 5)


// * Events


