'use strict'

var gGameBoard
var ROWS_AMOUNT
var COLS_AMOUNT
var gameLevel = 4
var gIsVictory = false

const MINE_IMG = `<img class="mine" src="img/mine3.png">`
const FLAG_IMG = `<img class="flag" src="img/flag.png">`


var currentCell = null
var gMinesOnBoard = null
var gFlagsCount 

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    createGameBoard(gameLevel)
    renderGameBoard()
    onRightClick()
    gFlagsCount = 2
    addMines()
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

            if (gIsVictory) {
                return
            }
            var rowIdx = clickedCell.getAttribute('data-row')
            var colIdx = clickedCell.getAttribute('data-col')
            const cellIdx = (gGameBoard[rowIdx][colIdx])

            // If the cell has a shown value of how many mines Around Count, there shouldn't be an option to flag this cell
            if (cellIdx.isShown) {
                return
            }


            if (!cellIdx.isMarked && !gIsVictory) {
                // model - 
                // to change isMarked to true
                // checks that the flags amount is equal to the mines amount
                if (gGame.markedCount >= gMinesOnBoard) {
                    console.log('you are not allowed to add more flags')
                    return
                }

                cellIdx.isMarked = true
                gFlagsCount--

                // to add 1 to the gGame markedCount - flags.
                gGame.markedCount++

                // DOM - 
                clickedCell.innerHTML = FLAG_IMG
                clickedCell.classList.add('flag')


            } else {
                // at second click:
                cellIdx.isMarked = false
                gGame.markedCount--
                gFlagsCount++
                clickedCell.innerHTML = ''
                clickedCell.classList.remove('flag')
                document.querySelector('.flags-amount').innerHTML = `You have ${gFlagsCount} flags to use`
                console.log(document.querySelector('.flags-amount').innerHTML)
            }


            // checks if the the cell contains a mine & is flagged
            if (cellIdx.isMarked && cellIdx.isMine) {
                console.log('flagged correctly')
                gFlagsCount--
            }

            console.log(gGame.markedCount)
            console.log('Right clicked:', clickedCell)

            document.querySelector('.flags-amount').innerHTML = `You have ${gFlagsCount} flags to use`
            console.log(document.querySelector('.flags-amount').innerHTML)
        })
    })
}


function onCellClicked(elCell, rowIdx, colIdx) {
    if (!gGame.isOn) {
        return
    }


    if (gIsVictory) {
        return
    }

    // If mines have not been added, call the addMines function
    // first clicked cell will never contain a mine 
    // set timeout to solve the issue of the mines that is generated too fast  
    if (gMinesOnBoard === null) {
        setTimeout(function () {
            addMines(gameLevel);
            revealCellContent(gGameBoard, rowIdx, colIdx)
        }, 200);
    }

    console.log(gMinesOnBoard)

    const cell = gGameBoard[rowIdx][colIdx]
    console.log('Cell clicked: ', elCell, rowIdx, colIdx)

    if (cell.isMarked) {
        cell.isMarked = false
        gFlagsCount++
        gGame.markedCount--
        document.querySelector('.flags-amount').innerHTML = `You have ${gFlagsCount} flags to use`
        console.log(document.querySelector('.flags-amount').innerHTML)
    }

    // disable click on a visible mines 
    if (cell.isShown) {
        return
    }


    cell.isShown = true

    if (cell.isMine) {
        gameOver()
    } else {
        revealCellContent(gGameBoard, rowIdx, colIdx)
        gGame.shownCount++

        // test-------------------
        setTimeout(isVictory, 200)

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


function addMines(gameLevel) {
    var strHTML = ''

    if (gameLevel === 4) {
        gMinesOnBoard = 2
        gFlagsCount = 2
    } else if (gameLevel === 8) {
        gMinesOnBoard = 14
        gFlagsCount = 14
    } else if (gameLevel === 12) {
        gMinesOnBoard = 32
        gFlagsCount = 32
    }

    var minesToCreate = gMinesOnBoard
    console.log('nies to create" + minesToCreate')
    // Update DOM:
    strHTML = `<h2> There are ${gMinesOnBoard} mines on the board</h2>`
    document.querySelector('.mines-amount').innerHTML = strHTML

    // add mines as long as the isMine is false 
    while (minesToCreate > 0) {
        var randomRow = getRandomInt(0, gGameBoard.length - 1)
        var randomCol = getRandomInt(0, gGameBoard[0].length - 1)
        if (!gGameBoard[randomRow][randomCol].isMine) {
            // put a mine in this cell

            // Update the model:
            gGameBoard[randomRow][randomCol].isMine = true

            // gMinesOnBoard++
            minesToCreate--;



            // --------------------------------- for testing -----------------------------
            var elRandomCell = document.querySelector(`.cell-${randomRow}-${randomCol}`)
            elRandomCell.innerHTML = MINE_IMG
        }
    }

    console.log('mines on board ' + gMinesOnBoard)
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


function chooseLevelBtn(elBtn) {
    gameLevel = parseInt(elBtn.getAttribute('data-level'))
    createGameBoard(gameLevel)
    renderGameBoard()
    addMines(gameLevel)
    
    var cells = document.querySelectorAll('.cell');

    cells.forEach(function(cell) {
        cell.classList.add('expert');
    });

    document.querySelector('.flags-amount').innerHTML = `You have ${gFlagsCount} flags to use`
}

// isVictory(gGameBoard)
function isVictory() {
    var boardSize = gameLevel ** 2
    var cellsAmount = boardSize - gMinesOnBoard

    if (gGame.shownCount === cellsAmount) {
        // alert('victory')
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
        gameStatusBtn.setAttribute('src', newSrc)
        gameStatusBtn.classList.add('win')
        statusTitle.innerHTML = 'You win! Tickle me to restart'

    } if (!gGame.isOn) {
        var newSrc = currentSrc.replace("img/good-status.png", "img/sad.png")
        gameStatusBtn.setAttribute('src', newSrc)
        statusTitle.innerHTML = 'You lose! Tickle me to restart'
    }

}


// to reduce lines here and to fix the functions gameStatus() && restartBtn()

function restartBtn() {
    onInit()
    var statusTitle = document.querySelector('.game-status-title')
    var gameStatusBtn = document.querySelector('.game-status-btn')
    var currentSrc = gameStatusBtn.getAttribute('src')
    var newSrc = currentSrc.replace("img/sad.png", "img/good-status.png")

    if (currentSrc === "img/win.png"){
        newSrc = currentSrc.replace("img/win.png", "img/good-status.png")
        gameStatusBtn.classList.remove('win')
    }

    gameStatusBtn.setAttribute('src', newSrc)
    statusTitle.innerHTML = 'Tickle me to restart'

}
