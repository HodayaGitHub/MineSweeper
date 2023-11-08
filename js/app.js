'use strict'

var gGameBoard
const ROWS_AMOUNT = 4
const COLS_AMOUNT = 4

const MINE_IMG = 'img/mine.png'

var currentCell = null
var gMinesOnBoard = 0



function onInit() {
    gGameBoard = createGameBoard()
    renderGameBoard()
    // console.log(gGameBoard)

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
                isMine: (row === 1 && col === 2 || row === 3 && col === 1),
                isMarked: true
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

            if (currentCell.isMine) {
                var mineClass = 'mine'
                currentCell = `<img class="mine" src='${MINE_IMG}''>`
            } else {
                currentCell = ''
                mineClass = ''
            }


            strHTML += `\t<td class="${className} ${mineClass}"
             data-row = "${rowIdx}" data-col="${colIdx}"
             onclick="onCellClicked(this, ${rowIdx}, ${colIdx})"> ${currentCell}</td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elcells = document.querySelector('.board-cells')
    elcells.innerHTML = strHTML
}



function onCellClicked(elCell, rowIdx, colIdx) {
    const cell = gGameBoard[rowIdx][colIdx]
    console.log('Cell clicked: ', elCell, rowIdx, colIdx)
    setMinesNegsCount(gGameBoard, rowIdx, colIdx)
}


// function showNeighbors() {
//     // neighborsCount(gGameBoard, rowIdx, colIdx)
//     document.querySelectorAll('.neighbors')
//     forEach(neighbor => neighbor.classList.add('neighbor'))
// }


function setMinesNegsCount(board, rowIdx, colIdx) {
    var mineAroundCounter = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (rowIdx === i && colIdx === j) continue
            var elNeighbor = document.querySelector(`[data-row = "${i}"][data-col="${j}"]`)
            var elCurrentCell = document.querySelector(`[data-row = "${rowIdx}"][data-col="${colIdx}"]`)
            // console.log(i, j)

            handleNeibhor(gGameBoard, i, j)

            // update the clicked cell number:
            var currentCell = gGameBoard[i][j]
            if (currentCell.isMine === true) {
                mineAroundCounter++

                // Model update:
                currentCell.minesAroundCount = mineAroundCounter
                console.log(currentCell)

                // DOM update:
                elNeighbor.classList.add('mine')
                elCurrentCell.innerHTML = mineAroundCounter
            }
        }

    }

    // console.log(mineAroundCounter)
    return mineAroundCounter
}


function handleNeibhor(board, neighborRow, neighborCol) {
    //    var neighborCell = gGameBoard[neighborRow][neighborCol]
    var mineAroundCounter = 0
    var elNeighbor = document.querySelector(`[data-row = "${neighborRow}"][data-col="${neighborCol}"]`)

    for (var i = neighborRow - 1; i <= neighborRow + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = neighborCol - 1; j <= neighborCol + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (neighborRow === i && neighborCol === j) continue
            var elCurrentCell = document.querySelector(`[data-row = "${i}"][data-col="${j}"]`)


            // update the current cell number:
            var currentCell = gGameBoard[i][j]

            if (currentCell.isMine === true) {
                mineAroundCounter++

                // Model update:
                currentCell.minesAroundCount = mineAroundCounter


                // DOM update:
                elCurrentCell.classList.add('mine')
                elNeighbor.innerHTML = mineAroundCounter
            }


            // change empty cells to gray 
            // console.log(currentCell.mineAroundCounter)
            // if (currentCell.mineAroundCounter === 0) {
            //     elCurrentCell.classList.add('no-mines-around');
            // }
        }
        
    }


    // console.log('this is the amount of mines around: ' + mineAroundCounter)
    return mineAroundCounter;
}




function addMines() {
	var randomRow = getRandomInt(0, gGameBoard.length)
	var randomCol = getRandomInt(0, 10)

	var renderMines = gBoard[randomRow][randomCol]

	//Checks the the cell is empty
	if (renderMines.gameElement ) {
		renderMines.gameElement = MINE
		var randomCell = document.querySelector(`.cell-${randomRow}-${randomCol}`)
		randomCell.innerHTML = MINE_IMG
		gMinesOnBoard++
	}
}


function gameOver(){
}