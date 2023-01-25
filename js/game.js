'use strict'

const MINE = '💣'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
   }
   
var gLevel = {
    size: 4,
    mines: 2,
}

var gBoard

function onInit(){
    gBoard = buildBoard(gLevel.size, gLevel.mines)
    console.log('gBoard',gBoard)
    renderBoard(gBoard)


}

function buildBoard(size, mines) {
    var board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                gameElement: '',
                location: {i,j}
            }
        }
    }
    //This is the randomize solution!
    // for (let i = 0; i < mines; i++) {
    //     board[getRandomIntInclusive(0,board.length-1)][getRandomIntInclusive(0,board.length-1)].gameElement = MINE
    // }

    //static location for Developing!
    board[0][0].gameElement = MINE
    board[1][2].gameElement = MINE

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].gameElement === MINE) {
                board[i][j].isMine = true
            }
        }
    }
    
    return board
}

function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j].gameElement
            var strClass = getClassName({ i: i, j: j })

            // if (currCell.gameElement === MINE) strClass += ' floor'
            // else if (currCell.type === WALL) strClass += ' wall'

            strHTML += `\t<td onclick = "onCellClicked(${i},${j})" class="cell ${strClass}">${currCell}`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:')
    console.log(strHTML)
    elBoard.innerHTML = strHTML
}


function onCellClicked(elloci,ellocj) {
    
 setMinesNegsCount(elloci,ellocj,gBoard)
}

function setMinesNegsCount(cellI,cellJ,board){
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if(board[i][j].gameElement === MINE){
                negsCount++
            }
        }
    }
    // console.log('negsCount',negsCount)
    board[cellI][cellJ].minesAroundCount = negsCount
    var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    if(negsCount > 0){
        elCell.innerText = board[cellI][cellJ].minesAroundCount
    }
    console.log('negsCount',board[cellI][cellJ].minesAroundCount)
    // return negsCount
}