'use strict'

var gGameBoard
const ROWS_AMOUNT = 4
const COLS_AMOUNT = 4

const MINE_IMG = `<img class="mine" src='img/mine.png'>`
const FLAG_IMG = `<img class="mine" src='img/flag.png'>`

var currentCell = null
var gMinesOnBoard = 0


var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gGameBoard = createGameBoard()
    renderGameBoard()
    addMines(3)
    onRightClick()
}

// creating the board for the model
function createGameBoard() {
    const board = []

    for (var row = 0; row < ROWS_AMOUNT; row++) {
        board[row] = []
        // console.log(board[row])
        for (var col = 0; col < COLS_AMOUNT; col++) {
            const cell = {
                row,
                col,
                minesAroundCount: 0,
                isShown: false,
                // isMine: (row === 1 && col === 2 || row === 3 && col === 1),
                isMine: false,
                isMarked: false,
            }

            board[row][col] = cell
        }
    }
    return board
}

// creating the table - DOM 
function renderGameBoard() {
    var strHTML = ''

    console.log(gGameBoard)

    for (var rowIdx = 0; rowIdx < gGameBoard.length; rowIdx++) {
        strHTML += `<tr class="board-row" >\n`
        for (var colIdx = 0; colIdx < gGameBoard[0].length; colIdx++) {
            currentCell = gGameBoard[rowIdx][colIdx]
            const className = `cell cell-${rowIdx}-${colIdx}`
            currentCell = ''

            strHTML += `\t<td class="${className}"
             data-row = "${rowIdx}" data-col="${colIdx}"
             onclick="onCellClicked(this, ${rowIdx}, ${colIdx})"> ${currentCell}</td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elcells = document.querySelector('.board-cells')
    elcells.innerHTML = strHTML
}


function onRightClick() {
    var allCells = document.querySelectorAll('.cell')
    // console.log(allCells)

    allCells.forEach((clickedCell) => {
        clickedCell.addEventListener('contextmenu', function (event) {
            event.preventDefault()
            if (!gGame.isOn) {
                return
            }

            var rowIdx = clickedCell.getAttribute('data-row');
            var colIdx = clickedCell.getAttribute('data-col');
            const cellIdx = (gGameBoard[rowIdx][colIdx])

            // If the cell has a shown value of how many mines Around Count, there shouldn't be an option to flag this cell
            if (cellIdx.isShown) {
                return
            }

            if (!cellIdx.isMarked) {

                // model - 
                // to change isMarked to true
                cellIdx.isMarked = true

                // to add 1 to the gGame markedCount - flags.
                gGame.markedCount++

                // DOM - 
                clickedCell.innerHTML = FLAG_IMG

            } else {
                // at second click:
                cellIdx.isMarked = false
                gGame.markedCount--
                clickedCell.innerHTML = ''
            }
            console.log(gGame.markedCount)

            // console.log('Right mouse button clicked on this cell:', clickedCell)
        })
    })

}


function onCellClicked(elCell, rowIdx, colIdx) {
    if (!gGame.isOn) {
        return
    }
    const cell = gGameBoard[rowIdx][colIdx]
    console.log('Cell clicked: ', elCell, rowIdx, colIdx)

    // disable click on a visible mines 
    if (cell.isShown) {
        return
    }

    cell.isShown = true

    if (cell.isMine) {
        gameOver()
    } else {
        revealCellContent(gGameBoard, rowIdx, colIdx)
    }
}


function revealCellContent(board, row, col) {
    var mineAroundCounter = 0
    var elNeighbor = document.querySelector(`[data-row = "${row}"][data-col="${col}"]`)
    const neighborCell = board[row][col]

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (row === i && col === j) continue

            // update the current cell number:
            var currentCell = gGameBoard[i][j]

            if (currentCell.isMine === true) {
                mineAroundCounter++
            }
        }
    }

    // Model update:
    neighborCell.minesAroundCount = mineAroundCounter
    // DOM update:
    elNeighbor.innerHTML = mineAroundCounter

    // console.log('this is the amount of mines around: ' + mineAroundCounter)
    return mineAroundCounter;
}


function addMines(minesAmount) {

    // add mines as long as the isMine is false 
    while (minesAmount > 0) {
        var randomRow = getRandomInt(0, gGameBoard.length - 1)
        var randomCol = getRandomInt(0, gGameBoard[0].length - 1)
        if (!gGameBoard[randomRow][randomCol].isMine) {
            // put a mine in this cell

            // Update the model:
            gGameBoard[randomRow][randomCol].isMine = true

            gMinesOnBoard++
            minesAmount--;


            // --------------------------------- for testing -----------------------------
            // var elRandomCell = document.querySelector(`.cell-${randomRow}-${randomCol}`)
            // elRandomCell.innerHTML = MINE_IMG
        }
    }
}


function gameOver() {
    gGame.isOn = false

    for (var rowIdx = 0; rowIdx < gGameBoard.length; rowIdx++) {
        for (var colIdx = 0; colIdx < gGameBoard[0].length; colIdx++) {
            currentCell = gGameBoard[rowIdx][colIdx]
            if (currentCell.isMine) {

                // Update DOM 
                var elRandomCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
                elRandomCell.innerHTML = MINE_IMG
            }
        }
    }
    alert('game over')

}