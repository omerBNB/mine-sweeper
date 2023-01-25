'use strict'

const MINE = '💣'

var gTimerInterval

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstclick: false,
    lives: 3,
    isVinner: false,
}

var gLevel = {
    size: 4,
    mines: 2,
}

var gBoard

function onInit() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    gGame.isOn = true
    gGame.isVinner = false
    gGame.lives = 3
    gGame.shownCount = 0
    var elSpan = document.querySelector(`span`)
    elSpan.innerText = '😁'
    var lives = livesCount(gGame.lives)
    var elH3Lives = document.querySelector(`h3`)
    elH3Lives.innerText = lives
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
}

function startgame() {
    createMines(gLevel.mines, gBoard)
}

function buildBoard(size) {
    var board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                cover: '',
                isMine: false,
                isMarked: false,
                gameElement: '',
                location: { i, j }
            }
        }
    }
    //This is the randomize solution!
    // for (let i = 0; i < mines; i++) {
    //     board[getRandomIntInclusive(0,board.length-1)][getRandomIntInclusive(0,board.length-1)].gameElement = MINE
    // }

    //static location for Developing!

    return board
}

function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = (board[i][j].isShown) ? board[i][j].gameElement : board[i][j].cover
            var strClass = getClassName({ i: i, j: j })

            // if (currCell.gameElement === MINE) strClass += ' floor'
            // else if (currCell.type === WALL) strClass += ' wall'

            strHTML += `\t<td id="td" onclick="onCellClicked(${i},${j})" class="cell ${strClass}">${currCell}`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:')
    // console.log(strHTML)
    elBoard.innerHTML = strHTML
    var elTd = document.getElementById("td")
    elTd.addEventListener("contextmenu", (e) => {e.preventDefault()})
}

function onCellClicked(elloci, ellocj) {
    if (!gGame.isOn) {
        return
    }
    if (!gGame.isFirstclick) {
        gGame.isFirstclick = true
        startgame()
        timer()
    }
    var currLocation = gBoard[elloci][ellocj]
    var elH2 = document.querySelector(`span`)
    elH2.innerText = '😯'
    currLocation.isShown = true
    renderCell({ i: elloci, j: ellocj }, currLocation.gameElement)

    var elCell = document.querySelector(`.cell-${elloci}-${ellocj}`)
    if (elCell.style.backgroundColor === 'red') {
        return
    }

    if (currLocation.gameElement === MINE) {
        var elCell = document.querySelector(`.cell-${elloci}-${ellocj}`)
        elCell.style.backgroundColor = 'red'
        elH2.innerText = '😵'
        gGame.lives--
        var lives = livesCount(gGame.lives)
        var elH3Lives = document.querySelector(`h3`)
        elH3Lives.innerText = lives
        if (gGame.lives === 0) {
            gameOver()
        }
    }
    var negs = setMinesNegsCount(elloci, ellocj, gBoard)
    currLocation.minesAroundCount = negs
    var elCell = document.querySelector(`.cell-${elloci}-${ellocj}`)
    if (negs > 0 && currLocation.gameElement !== MINE) {
        gGame.shownCount++
        currLocation.gameElement = negs
        elCell.innerText = currLocation.gameElement
        elCell.style.backgroundColor = 'rgb(228, 225, 225'
        // setTimeout(() => { elH2.innerText = '😁' }, 300)
    }
    if (negs === 0 && currLocation.gameElement !== MINE) {
        revealNegs(elloci, ellocj, gBoard)
        elCell.innerText = currLocation.gameElement
        elCell.style.backgroundColor = 'rgb(228, 225, 225'
        // setTimeout(() => { elH2.innerText = '😁' }, 300)
    }

    checkIsVinner()
    if (gGame.isVinner) {
        gameOver()
    }
    console.log('gGame.shownCount', gGame.shownCount)
}


function placeflag(ev) {
    console.log('example', ev)
}

function setMinesNegsCount(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].gameElement === MINE) {
                negsCount++
            }
        }
    }
    // console.log('negsCount',negsCount)
    return negsCount
}

function revealNegs(cellI, cellJ, board) {
    var negsCount = 0
    var currnegs = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            negsCount++
            currnegs.push(gBoard[i][j])
        }
    }
    for (let i = 0; i < negsCount; i++) {
        var currentnegRow = currnegs[i].location.i;
        var currentnegCol = currnegs[i].location.j;
        var newnegs = setMinesNegsCount(currentnegRow, currentnegCol, board)
        var elCell = document.querySelector(`.cell-${currentnegRow}-${currentnegCol}`)
        if (newnegs === 0) {
            elCell.innerText = gBoard[currentnegRow][currentnegCol].gameElement
            elCell.style.backgroundColor = 'rgb(228, 225, 225)'
            gGame.shownCount++
        } else {
            elCell.innerText = newnegs
            elCell.style.backgroundColor = 'rgb(228, 225, 225)'
            gGame.shownCount++
        }
    }
    gGame.shownCount++
}


function gameOver() {
    var elModal = document.querySelector('.modal')
    var elmsg = document.querySelector('.user-msg')
    if (gGame.isVinner) {
        elmsg.innerText = 'You Won!'
        var elH2 = document.querySelector(`span`)
        elH2.innerText = '😎'
    } else {
        elmsg.innerText = 'You Lose!'
    }
    elModal.style.display = 'block'
    gGame.isOn = false
    gGame.isFirstclick = true
    clearInterval(gTimerInterval)
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}
function createMines(mines, board) {
    var emptyPos
    for (let i = 0; i < mines; i++) {
        emptyPos = getEmptypos()
        board[emptyPos[0]][emptyPos[1]].gameElement = MINE
        if (board[emptyPos[0]][emptyPos[1]].gameElement === MINE) {
            board[emptyPos[0]][emptyPos[1]].isMine = true
        }
    }
}

function getEmptypos() {
    var emptypos = []
    for (let i = 0; i < gBoard.length; i++) {
        var currRow = gBoard[i];
        // console.log('currRow',currRow)
        for (let j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j].gameElement;
            if (!currCell) {
                emptypos.push([[i], [j]])
            }
        }
    }
    if (!gBoard.length) return null
    var randidx = getRandomIntInclusive(0, emptypos.length - 1)
    var randpos = emptypos[randidx]
    return randpos
}


function livesCount(lives) {
    var liveLeft = ''
    for (let i = 0; i < lives; i++) {
        var life = '❤️'
        liveLeft += life
    }
    return liveLeft
}

function levels(btn) {
    var elTable = document.querySelector(`table`)
    var elTimer = document.querySelector(`.timer`)
    if (btn.innerText === 'Easy') {
        gLevel = {
            size: 4,
            mines: 2,
        }
        elTable.style.width = '320px'
    }
    if (btn.innerText === 'Hard') {
        gLevel = {
            size: 8,
            mines: 14,
        }
        elTable.style.width = '380px'
    }
    if (btn.innerText === 'Extreme') {
        gLevel = {
            size: 12,
            mines: 32,
        }
        elTable.style.width = '450px'
    }
    elTimer.innerText = '00:00'
    gGame.isFirstclick = false
    clearInterval(gTimerInterval)
    onInit()
}

function checkIsVinner() {
    if (gBoard.length ** 2 - gGame.shownCount - gLevel.mines === 0) {
        gGame.isVinner = true
    }
}