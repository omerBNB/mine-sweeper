'use strict'
// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getEmptypos() {
    var emptypos = []
    for (let i = 0; i < gBoard.length; i++) {
        var currRow = gBoard[i];
        // console.log('currRow',currRow)
        for (let j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell === EMPTY) {
                emptypos.push([[i], [j]])
            }
        }
    }
    if (!gBoard.length) return null
    var randidx = getRandomIntInclusive(0, emptypos.length - 1)
    var randpos = emptypos[randidx]
    return randpos
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var strClass = getClassName({ i: i, j: j })

            if (currCell.type === FLOOR) strClass += ' floor'
            else if (currCell.type === WALL) strClass += ' wall'

            strHTML += `\t<td class="cell ${strClass}" onclick="moveTo(${i},${j})">`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:')
    // console.log(strHTML)
    elBoard.innerHTML = strHTML
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

function playSound() {
    var sound = new Audio('media/Glory.mp3')
    sound.play()
}

function countInSecondaryDiagonal(symbol, board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        if (board[i][board.length - 1 - i] === symbol) count++
    }
    return count
}

function countInPrimaryDiagonal(symbol, board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        if (board[i][i] === symbol) count++
    }
    return count
}

function countInCol(colIdx, symbol, board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        if (board[i][colIdx] === symbol) count++
    }
    return count
}

function countInRow(rowIdx, symbol, board) {
    var count = 0
    for (var i = 0; i < board[rowIdx].length; i++) {
        if (board[rowIdx][i] === symbol) count++
    }
    return count
}

function drawNum() {
    var idx = getRandomInt(0, nums.length)
    var num = nums[idx]
    nums.splice(idx, 1)
    return num
}

function getNums(count) {
    var nums = []
    for (var i = 1; i <= count; i++) {
        nums.push(i)
    }
    return nums
}

function timer() {
    // set var gTimerInterval and html element (div or span) with timer class to start
    var timer = document.querySelector('.timer')
    var start = Date.now()
    gTimerInterval = setInterval(function () {
        var currTs = Date.now()
        var secs = parseInt((currTs - start) / 1000)
        var ms = (currTs - start) - secs * 1000
        ms = '000' + ms
        // mlSeconds length
        ms = ms.substring(ms.length - 3, ms.length)
        //Rendering 
        timer.innerText = `${secs}:${ms}`
    }, 100)
}

function shuffle(array) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
//Examples

// function createPlayer(board) {
//     // initialize gPlayer...
//     gPlayer = {
//         location: {
//             i: 6,
//             j: 7
//         },
//         isSuper: false
//     }
//     board[gPlayer.location.i][gPlayer.location.j] = player
// }

// function copyMat(mat) {
//     var newMat = []
//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = []
//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j]
//         }
//     }
//     return newMat
// }
