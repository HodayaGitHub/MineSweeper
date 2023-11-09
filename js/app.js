'use strict'

var gGameBoard
var ROWS_AMOUNT
var COLS_AMOUNT
var gGameLevel = 4
var gIsVictory

const MINE_IMG = `<img class="mine" src="img/monster-icon.png">`
const FLAG_IMG = `<img class="flag" src="img/flag.png">`

var currentCell
var gMinesAndFlagsOnBoard
var gGame


function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isMinesRendered: false,
        lives: 0,
        isHintOn: false,
    }

    gMinesAndFlagsOnBoard = null
    currentCell = null
    gIsVictory = false
    initMinesAndFlags()
    createGameBoard(gGameLevel)
    renderGameBoard()
    onRightClick()
}

function initMinesAndFlags() {
    var strHTML = ''

    if (gGameLevel === 4) {
        gMinesAndFlagsOnBoard = 2
        gGame.lives = 2
    } else if (gGameLevel === 8) {
        gMinesAndFlagsOnBoard = 14
        gGame.lives = 3
    } else if (gGameLevel === 12) {
        gMinesAndFlagsOnBoard = 32
        gGame.lives = 4
    }


    console.log('nies to create" + minesToCreate')
    // Update DOM:
    strHTML = `<span> There are ${gMinesAndFlagsOnBoard} mines on the board</span>`
    document.querySelector('.mines-amount').innerHTML = strHTML

}

// creating the board for the model
function createGameBoard(gameLevel) {
    gameLevel = gameLevel
    console.log('test row' + gameLevel);
    console.log('test col' + gameLevel);
    const board = []
    for (var row = 0; row < gameLevel; row++) {
        board[row] = []
        // console.log(board[row])
        for (var col = 0; col < gameLevel; col++) {
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
    gGameBoard = board
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

            var rowIdx = clickedCell.getAttribute('data-row')
            var colIdx = clickedCell.getAttribute('data-col')
            const cellIdx = (gGameBoard[rowIdx][colIdx])

            // If the cell has a shown value of how many mines Around Count, there shouldn't be an option to flag this cell
            if (cellIdx.isShown) {
                return
            }

            if (!cellIdx.isMarked) {
                // checks that the flags amount is equal to the mines amount
                if (gGame.markedCount >= gMinesAndFlagsOnBoard) {
                    return
                }

                cellIdx.isMarked = true

                // to add 1 to the gGame markedCount - flags.
                gGame.markedCount++

                // DOM - 
                clickedCell.innerHTML = FLAG_IMG
                clickedCell.classList.add('flag')

            } else {
                // at second click:
                cellIdx.isMarked = false
                gGame.markedCount--
                clickedCell.innerHTML = ''
                clickedCell.classList.remove('flag')
            }
            isVictory()
            updateFlags()
        })
    })
}


function onCellClicked(elCell, rowIdx, colIdx) {
    if (!gGame.isOn) {
        return
    }

    const cell = gGameBoard[rowIdx][colIdx]


    // If mines have not been added, call the addMines function
    // first clicked cell will never contain a mine 
    if (!gGame.isMinesRendered) {
        renderMines(rowIdx, colIdx);
    }

    // disable click on a flag and on a revealed cell
    if (cell.isMarked || cell.isShown) {
        return
    }

    console.log('Cell clicked: ', elCell, rowIdx, colIdx)

    if (gGame.isHintOn) {
        hintPeek(gGameBoard, rowIdx, colIdx, true)
        setTimeout(() => hintPeek(gGameBoard, rowIdx, colIdx, false), 1000)
        gGame.isHintOn = false
        document.querySelector(".selected:not(.hidden)").classList.add('hidden')
        return
    }

    if (cell.isMine) {
        elCell.style.backgroundColor = '#a9245d'
        gGame.shownCount++
        cell.isShown = true
        elCell.innerHTML = MINE_IMG
        reduceLives()
    } else {
        revealClickedCellContent(gGameBoard, rowIdx, colIdx)
        setTimeout(isVictory, 200)
    }

}

// this func should peek a cell and neb 
function hintPeek(board, row, col, shouldShow) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            const cell = board[i][j]
            var elCell = document.querySelector(`[data-row = "${i}"][data-col="${j}"]`)

            if (shouldShow) {
                if (cell.isMine) {
                    elCell.innerHTML = MINE_IMG
                } else {
                    var counter = countMinesAroundCell(board, i, j)
                    elCell.innerHTML = counter
                }
            } else if (!cell.isShown) {
                  elCell.innerHTML = ""
            }
        }
    }    
}


function revealClickedCellContent(board, row, col) {
    var mineAroundCounter = 0
    var elClickedCell = document.querySelector(`[data-row = "${row}"][data-col="${col}"]`)
    const clickedCell = board[row][col]
    var neighbors = []

    if (clickedCell.isShown) {
        return
    }

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (row === i && col === j) continue

            // update the current cell number:
            var currentNeighborCell = gGameBoard[i][j]

            neighbors.push(currentNeighborCell)

            if (currentNeighborCell.isMine === true) {
                mineAroundCounter++
            }
            // console.log(currentNeighborCell)
        }
    }

    // Model update:

    if (clickedCell.isMarked) {
        clickedCell.isMarked = false
        gGame.markedCount--
        updateFlags()
    }

    clickedCell.minesAroundCount = mineAroundCounter
    gGame.shownCount++
    clickedCell.isShown = true

    // DOM update:
    elClickedCell.innerHTML = mineAroundCounter

    // if the current cell returns 0, it means that there are no monsters around this cell
    // and the reveal should be expanded
    if (mineAroundCounter == 0) {
        for (var x = 0; x < neighbors.length; x++) {
            // console.log(neighbors[x].row, neighbors[x].col)
            revealNeighborContent(board, neighbors[x].row, neighbors[x].col)
        }
    }
    // console.log('this is the amount of mines around: ' + mineAroundCounter)
    return mineAroundCounter;
}


function countMinesAroundCell(board, row, col) {
    var mineAroundCounter = 0
    
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (row === i && col === j) continue

            // update the current cell number:
            var currentNeighborCell = gGameBoard[i][j]
            
            if (currentNeighborCell.isMine === true) {
                mineAroundCounter++
            }
        }
    }
    return mineAroundCounter;
}


function revealNeighborContent(board, neighborRow, neighborCol) {
    var mineAroundCounter = 0
    var elNeighbor = document.querySelector(`[data-row = "${neighborRow}"][data-col="${neighborCol}"]`)
    const neighborCell = board[neighborRow][neighborCol]

    if (neighborCell.isShown) {
        return
    }

    for (var i = neighborRow - 1; i <= neighborRow + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = neighborCol - 1; j <= neighborCol + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (neighborRow === i && neighborCol === j) continue

            // update the current cell number:
            var currentNeighborCell = gGameBoard[i][j]
            if (currentNeighborCell.isMine === true) {
                mineAroundCounter++
            }
        }
    }


    if (neighborCell.isMarked) {
        neighborCell.isMarked = false
        gGame.markedCount--
        updateFlags()
    }
    // Model update:
    neighborCell.minesAroundCount = mineAroundCounter
    gGame.shownCount++
    neighborCell.isShown = true


    // DOM update:
    elNeighbor.innerHTML = mineAroundCounter

    // console.log('this is the amount of mines around: ' + mineAroundCounter)
    return mineAroundCounter;
}


function provideHint(elBtn) {
    if (gGame.isHintOn || !gGame.isMinesRendered) {
        return
    }

    gGame.isHintOn = true
    elBtn.classList.add("selected")
}


function updateFlags() {
    document.querySelector('.flags-amount').innerHTML = `You have ${gMinesAndFlagsOnBoard - gGame.markedCount} flags to use`
}


function renderMines(row, col) {

    var minesToCreate = gMinesAndFlagsOnBoard

    // add mines as long as the isMine is false 
    while (minesToCreate > 0) {
        var randomRow = getRandomInt(0, gGameBoard.length - 1)
        var randomCol = getRandomInt(0, gGameBoard[0].length - 1)

        if (gGameBoard[randomRow][randomCol].isMine) {
            continue
        }

        // If the clicked cell is equal to the random cell, continue.
        // for preventing a mine on first click 
        if (row === randomRow && col === randomCol) {
            continue
        }

        // Update the model:
        gGameBoard[randomRow][randomCol].isMine = true

        // gMinesOnBoard++
        minesToCreate--;

        // --------------------------------- for testing -----------------------------
        // var elRandomCell = document.querySelector(`.cell-${randomRow}-${randomCol}`)
        // elRandomCell.innerHTML = MINE_IMG
    }
    gGame.isMinesRendered = true
    console.log('mines on board ' + gMinesAndFlagsOnBoard)
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
                // document.querySelector('.game-over-overlay').classList.remove('hidden')
            }
        }
    }
    gameStatus()
}


function reduceLives() {
    gGame.lives--
    gMinesAndFlagsOnBoard--
    updateFlags()

    if (gGame.lives === 0) {
        gameOver()
    }
    document.querySelector(".lives").innerHTML = `You have ${gGame.lives} remained`

}


function chooseLevelBtn(elBtn) {
    gGameLevel = parseInt(elBtn.getAttribute('data-level'))
    var cells = document.querySelectorAll('.cell');

    if (gGameLevel === 12) {
        document.querySelector('.game-board').classList.add('expert-board')
        document.querySelector('.game-board').classList.remove('meduim-board')

        cells.forEach(function (cell) {
            // to add here if for the different levels
            cell.classList.add('expert');
            cell.classList.remove('meduim');

        });
    } if (gGameLevel === 8) {
        document.querySelector('.game-board').classList.remove('expert-board')
        document.querySelector('.game-board').classList.add('meduim-board')
        cells.forEach(function (cell) {
            // to add here if for the different levels
            cell.classList.remove('expert');
            cell.classList.add('meduim');

        });
    }

    onInit()
    updateFlags()
}


function isVictory() {
    var boardSize = gGameLevel ** 2
    var cellsAmount = boardSize - gMinesAndFlagsOnBoard
    if (gGame.shownCount === cellsAmount && gMinesAndFlagsOnBoard === gGame.markedCount) {
        gGame.isOn = false
        gIsVictory = true

        gameStatus()
        return
    }
}


function gameStatus() {
    var gameStatusBtn = document.querySelector('.game-status-btn')
    var currentSrc = gameStatusBtn.getAttribute('src')
    var statusTitle = document.querySelector('.game-status-title')

    if (gIsVictory) {
        var newSrc = currentSrc.replace("img/good-status.png", "img/win.png")
        gameStatusBtn.classList.add('win')
        statusTitle.innerHTML = 'You win! Tickle me to restart'

    } else if (!gGame.isOn) {
        var newSrc = currentSrc.replace("img/good-status.png", "img/sad.png")
        statusTitle.innerHTML = 'You lose! Tickle me to restart'
    }

    gameStatusBtn.setAttribute('src', newSrc)
}


// to reduce lines here and to fix the functions gameStatus() && restartBtn()

function restartBtn() {
    onInit()

    var statusTitle = document.querySelector('.game-status-title')
    var gameStatusBtn = document.querySelector('.game-status-btn')
    var currentSrc = gameStatusBtn.getAttribute('src')
    var newSrc = currentSrc.replace("img/sad.png", "img/good-status.png")

    if (currentSrc === "img/win.png") {
        newSrc = currentSrc.replace("img/win.png", "img/good-status.png")
        gameStatusBtn.classList.remove('win')
    }

    gameStatusBtn.setAttribute('src', newSrc)
    statusTitle.innerHTML = 'Tickle me to restart'

}

