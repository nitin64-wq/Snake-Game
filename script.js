const board = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
let cells = Array(9).fill(null);
let playerSymbol = "X";
let aiSymbol = "O";
let gameStarted = false;
let difficulty = "hard";


function selectSymbol(symbol) {
    playerSymbol = symbol;
    aiSymbol = symbol === "X" ? "O" : "X";
    gameStarted = true;
    restartButton.classList.add("hidden");
    createBoard();
    if (playerSymbol === "O") {
        setTimeout(aiMove, 100);
    }
}

function setDifficulty(level) {
    difficulty = level;
}

function createBoard() {
    board.innerHTML = "";
    cells.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell || "";
        cellDiv.addEventListener("click", handleMove);
        board.appendChild(cellDiv);
    });
}

function handleMove(event) {
    if (!gameStarted) return;
    const index = event.target.dataset.index;
    if (!cells[index]) {
        cells[index] = playerSymbol;
        event.target.innerText = playerSymbol;
        event.target.classList.add("taken");
        if (checkWinner()) return;
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let move;
    if (difficulty === "easy") {
        move = randomMove();
    } else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? minimaxMove() : randomMove();
    } else {
        move = minimaxMove();
    }
    if (move !== undefined) {
        cells[move] = aiSymbol;
        createBoard();
        checkWinner();
    }
}

function randomMove() {
    let availableMoves = cells.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function minimaxMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i]) {
            cells[i] = aiSymbol;
            let score = minimax(cells, 0, false);
            cells[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let winner = checkWinner(true);
    if (winner === aiSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = aiSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(simulate = false) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            if (!simulate) {
                alert(`${cells[a]} wins!`);
                endGame();
            }
            return cells[a];
        }
    }
    if (!simulate && !cells.includes(null)) {
        alert("It's a draw!");
        endGame();
    }
    return null;
}

function endGame() {
    gameStarted = false;
    restartButton.classList.remove("hidden");
}

function restartGame() {
    cells = Array(9).fill(null);
    gameStarted = true;
    restartButton.classList.add("hidden");
    createBoard();
}

createBoard();
