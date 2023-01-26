'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gTimerInterval

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstclick: false,
    lives: 3,
    isVinner: false,
    hintsCount: 3,
    hintOnUse: false,
    minesCounter: 3,
}

var gLevel = {
    size: 4,
    mines: 3,
}

var gBoard

function onInit() {
    gBoard = buildBoard(gLevel.size)
    resetgame()
    renderBoard(gBoard)
}
var sound = new Audio('media/Glory.mp3')
function playSound() {
    sound.play()
    var boom = new Audio('media/bomb.mp3')
}
function startgame() {
    gGame.isFirstclick = true
    createMines(gLevel.mines, gBoard)
    sound.play()
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

            strHTML += `\t<td onclick="onCellClicked(${i},${j})" oncontextmenu="placeflag(this,${i},${j});" class="cell ${strClass}">${currCell}`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:')
    // console.log(strHTML)
    elBoard.innerHTML = strHTML
    // var elTd = document.getElementById("td")
    // elTd.addEventListener("contextmenu", (e) => {e.preventDefault()})
    var noRightClick = document.getElementById("td");
    noRightClick.addEventListener("contextmenu", e => e.preventDefault());
}

function onCellClicked(elloci, ellocj) {
    if (!gGame.isOn) {
        return
    }
    if (gBoard[elloci][ellocj].isMarked) {
        return
    }
    // if (!gGame.isFirstclick) {
    //     startgame()
    //     timer()
    // }
    if (!gGame.isFirstclick) {
        startgame()
        timer()
    }
    
    var currLocation = gBoard[elloci][ellocj]
    var elH2 = document.querySelector(`span`)
    elH2.innerText = '😯'


    var elCell = document.querySelector(`.cell-${elloci}-${ellocj}`)
    if (elCell.style.backgroundColor === 'red') {
        return
    }

    if (currLocation.gameElement === MINE && !gGame.hintOnUse) {
        var boom = new Audio('media/bomb.mp3')
        boom.play()
        renderCell({ i: elloci, j: ellocj }, currLocation.gameElement)
        currLocation.isShown = true
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
    } else if (currLocation.gameElement === MINE && gGame.hintOnUse) {
        useHint(negs, elloci, ellocj)
        for (let i = 0; i < 1; i++) {
            var elHint = document.querySelector(`.hint${gGame.hintsCount}`)
            elHint.style.display = 'none'
        }
        gGame.hintsCount--
        // console.log('gGame.hintsCount',gGame.hintsCount)
        gGame.hintOnUse = false
    }
    var negs = setMinesNegsCount(elloci, ellocj, gBoard)
    var elCell = document.querySelector(`.cell-${elloci}-${ellocj}`)

    if (negs > 0 && currLocation.gameElement !== MINE && !currLocation.isShown && !gGame.hintOnUse) {
        currLocation.isShown = true
        gGame.shownCount++
        currLocation.gameElement = negs
        elCell.innerText = currLocation.gameElement
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
        if (negs === 1) {
            elCell.style.color = 'blue'
        } else if (negs === 2) {
            elCell.style.color = 'green'
        } else if (negs === 3) {
            elCell.style.color = 'red'
        } else if (negs === 4) {
            elCell.style.color = 'black'
        } else if (negs === 5) {
            elCell.style.color = 'yellow'
        }
        // setTimeout(() => { elH2.innerText = '😁' }, 300)
    } else if (negs > 0 && currLocation.gameElement !== MINE && !currLocation.isShown && gGame.hintOnUse) {
        useHint(negs, elloci, ellocj)
        for (let i = 0; i < 1; i++) {
            var elHint = document.querySelector(`.hint${gGame.hintsCount}`)
            elHint.style.display = 'none'
        }
        gGame.hintsCount--
        // console.log('gGame.hintsCount',gGame.hintsCount)
        gGame.hintOnUse = false
    }

    if (negs === 0 && currLocation.gameElement !== MINE && !gGame.hintOnUse) {
        revealNegs(elloci, ellocj, gBoard)
        elCell.innerText = currLocation.gameElement
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
        // setTimeout(() => { elH2.innerText = '😁' }, 300)
    } else if (negs === 0 && currLocation.gameElement !== MINE && gGame.hintOnUse) {
        useHint(negs, elloci, ellocj)
        for (let i = 0; i < 1; i++) {
            var elHint = document.querySelector(`.hint${gGame.hintsCount}`)
            elHint.style.display = 'none'
        }
        gGame.hintsCount--
        // console.log('gGame.hintsCount',gGame.hintsCount)
        gGame.hintOnUse = false

    }
    // console.log('gBoard[elloci][ellocj].isShhown',gBoard[elloci][ellocj].isShhown)
    // console.log('gGame.shownCount', gGame.shownCount)
    checkIsVinner()
    if (gGame.isVinner) {
        gameOver()
    }
}

function placeflag(td, currcelli, currcellj) {
    var minesCounter = document.querySelector(`.minescounter1`)
    if (gGame.markedCount === gLevel.mines && !gBoard[currcelli][currcellj].isMarked) {
        return
    } else if (gGame.markedCount === gLevel.mines && gBoard[currcelli][currcellj].isMarked) {
        td.innerText = ''
        gGame.markedCount - 1
    }
    if (gBoard[currcelli][currcellj].isShown) {
        return
    }
    td.innerText = (gBoard[currcelli][currcellj].isMarked) ? '' : FLAG
    gBoard[currcelli][currcellj].isMarked = (gBoard[currcelli][currcellj].isMarked) ? false : true
    if (gBoard[currcelli][currcellj].isMarked) {
        gGame.markedCount++
        gGame.minesCounter--
    } else {
        gGame.markedCount--
        gGame.minesCounter++
    }
    minesCounter.innerText = gGame.minesCounter
    // console.log('gGame.markedCount', gGame.markedCount)
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
    var elCell1 = document.querySelector(`.cell-${cellI}-${cellJ}`)
    // console.log('elCell1', elCell1)
    if (!gBoard[cellI][cellJ].isShown) {
        gBoard[cellI][cellJ].isShown = true
        elCell1.innerText = gBoard[cellI][cellJ].gameElement
        elCell1.style.backgroundColor = 'rgb(228, 225, 225)'
        gGame.shownCount++
    }
    for (let i = 0; i < negsCount; i++) {
        var currentnegRow = currnegs[i].location.i;
        var currentnegCol = currnegs[i].location.j;
        var newnegs = setMinesNegsCount(currentnegRow, currentnegCol, board)
        var elCell = document.querySelector(`.cell-${currentnegRow}-${currentnegCol}`)
        if (newnegs === 0 && !gBoard[currentnegRow][currentnegCol].isShown) {
            gBoard[currentnegRow][currentnegCol].isShown = true
            elCell.innerText = gBoard[currentnegRow][currentnegCol].gameElement
            elCell.style.backgroundColor = 'rgb(228, 225, 225)'
            gGame.shownCount++
        }
        if (newnegs > 0 && !gBoard[currentnegRow][currentnegCol].isShown) {
            gBoard[currentnegRow][currentnegCol].isShown = true
            elCell.innerText = newnegs
            elCell.style.backgroundColor = 'rgb(228, 225, 225)'
            gGame.shownCount++
            if (newnegs === 1) {
                elCell.style.color = 'blue'
            } else if (newnegs === 2) {
                elCell.style.color = 'green'
            } else if (newnegs === 3) {
                elCell.style.color = 'red'
            } else if (newnegs === 4) {
                elCell.style.color = 'black'
            } else if (newnegs === 5) {
                elCell.style.color = 'yellow'
            }
        }
    }
    // gGame.shownCount++
}


function gameOver() {
    var elModal = document.querySelector('.modal')
    var elmsg = document.querySelector('.user-msg')
    if (gGame.isVinner) {
        elmsg.innerText = 'You Won!'
        var elH2 = document.querySelector(`span`)
        elH2.innerText = '😎'
        sound.pause()
        var winnersound = new Audio('media/winner.mp3')
        winnersound.play()
    } else {
        sound.pause()
        elmsg.innerText = 'You Lose!'
        var losersound = new Audio('media/lose.mp3')
        losersound.play()
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


function livesCount(livesAmount) {
    var liveLeft = ''
    for (let i = 0; i < livesAmount; i++) {
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
            mines: 3,
        }
        gGame.minesCounter = 3
        elTable.style.width = '320px'
    }
    if (btn.innerText === 'Hard') {
        gLevel = {
            size: 8,
            mines: 14,
        }
        gGame.minesCounter = 14
        elTable.style.width = '480px'
    }
    if (btn.innerText === 'Extreme') {
        gLevel = {
            size: 12,
            mines: 32,
        }
        gGame.minesCounter = 32
        elTable.style.width = '700px'
    } 
    elTimer.innerText = '00:00'
    gGame.isFirstclick = false
    clearInterval(gTimerInterval)
    resetgame()
    onInit()
}

function checkIsVinner() {
    if (gBoard.length ** 2 - gGame.shownCount - gLevel.mines === 0) {
        gGame.isVinner = true
    }
}

function resetgame() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    var elTimer = document.querySelector(`.timer`)
    elTimer.innerText = '00:00'
    var elMinesCounter = document.querySelector(`.minescounter1`)
    if(gBoard.length === 4){
        gGame.minesCounter = 3
    }else if (gBoard.length === 8){
        gGame.minesCounter = 14
    }else if (gBoard.length === 12){
        gGame.minesCounter = 32
    }
    elMinesCounter.innerText = gGame.minesCounter
    gGame.isOn = true
    gGame.isVinner = false
    gGame.lives = 3
    gGame.hintsCount = 3
    resetHints(gGame.hintsCount)
    resetSafeClicks()
    gGame.shownCount = 0
    var elSpan = document.querySelector(`span`)
    elSpan.innerText = '😁'
    var lives = livesCount(gGame.lives)
    // var hints = createHints(gGame.hints)
    var elH3Lives = document.querySelector(`h3`)
    elH3Lives.innerText = lives
    gGame.isFirstclick = false
    clearInterval(gTimerInterval)
}

function getHint(spechint) {
    spechint.classList.toggle('usedhint')
    if (spechint.classList.length === 2) {
        gGame.hintOnUse = true
    } else {
        gGame.hintOnUse = false
    }
}

function useHint(negCount, rowIdx, colIdx) {
    var elHintclass = document.querySelector('.usedhint')
    var elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    if (negCount === 0) {
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
    } else if (negCount > 0) {
        elCell.innerText = negCount
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
    } else if (gBoard[rowIdx][colIdx].gameElement === MINE) {
        elCell.innerText = MINE
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
    }
    setTimeout(() => {
        elCell.innerText = ''
        elCell.style.backgroundColor = 'rgb(255, 255, 255)'
        elHintclass.classList.remove('usedhint')
        gGame.hintOnUse = false
        gBoard[rowIdx][colIdx].isShown = false
    }, 1000)
}

function resetHints(hintsAmount) {
    var hint
    for (let i = 0; i < hintsAmount; i++) {
        hint = document.querySelector(`.hint${i + 1}`)
        hint.innerText = '💡'
        hint.style.display = 'inline-block'
    }
}

function countNegs(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
        }
    }
    return negsCount
}

function safeClicks(elSafeclick) {
    var randpos = getEmptySafeClick()
    // console.log('randpos',randpos)
    var i = randpos[0]
    var j = randpos[1]
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    if(elCell.style.backgroundColor === 'rgb(228, 225, 225)'){
        return
    }
    
    var negCount = countNegs(i,j,gBoard)
    if (negCount === 0) {
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
    } else if (negCount > 0) {
        elCell.innerText = negCount
        elCell.style.backgroundColor = 'rgb(228, 225, 225)'
    } 
    setTimeout(() => {
        elCell.innerText = ''
        elCell.style.backgroundColor = 'rgb(255, 255, 255)'
        gBoard[i][j].isShown = false
    }, 700)
    elSafeclick.style.display = 'none'
}

function resetSafeClicks(){
    // var safeclick = '🛟'
    for (let i = 1; i <= 3; i++) {
        var elSafeclick = document.querySelector(`.safe${i}`)
        elSafeclick.style.display = 'inline-block'
    }
}

function getEmptySafeClick() {
    var emptypos = []
    for (let i = 0; i < gBoard.length; i++) {
        var currRow = gBoard[i];
        // console.log('currRow',currRow)
        for (let j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j].gameElement
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (!gBoard[i][j].isMarked && !currCell && elCell.style.backgroundColor !== 'rgb(255, 255, 255)' && currCell.gameElement !== MINE && elCell.style.backgroundColor !== 'rgb(228, 225, 225)') {
                emptypos.push([i, j])
            }
        }
    }
    if (!gBoard.length) return null
    var randidx = getRandomIntInclusive(0, emptypos.length - 1)
    var randpos = emptypos[randidx]
    return randpos
}