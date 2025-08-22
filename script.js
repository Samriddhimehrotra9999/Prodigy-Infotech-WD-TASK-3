const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board = Array(9).fill(null);
let human = "X";
let ai = "O";
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Handle cell click
boardEl.addEventListener("click", (e) => {
  const idx = e.target.dataset.index;
  if (!idx || board[idx] || gameOver) return;

  makeMove(idx, human);

  if (checkWinner(board, human)) {
    setStatus("You win! 🎉", "win");
    highlightWin(human);
    gameOver = true;
    return;
  }
  if (isDraw(board)) {
    setStatus("It's a draw!", "draw");
    gameOver = true;
    return;
  }

  // AI move
  const bestMove = findBestMove(board);
  makeMove(bestMove, ai);

  if (checkWinner(board, ai)) {
    setStatus("AI wins! 🤖", "lose");
    highlightWin(ai);
    gameOver = true;
    return;
  }
  if (isDraw(board)) {
    setStatus("It's a draw!", "draw");
    gameOver = true;
    return;
  }
});

// Reset game
resetBtn.addEventListener("click", () => {
  board = Array(9).fill(null);
  gameOver = false;
  document.querySelectorAll(".cell").forEach((c) => {
    c.textContent = "";
    c.classList.remove("filled", "win-cell");
  });
  setStatus("Your turn (X)", null);
});

// Make a move
function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add("filled");
  cell.style.color = player === "X" ? "red" : "blue";
}

// Set status message
function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = ""; // reset
  if (type) statusEl.classList.add(type);
}

// Highlight winning cells
function highlightWin(player) {
  winPatterns.forEach((pattern) => {
    if (pattern.every((idx) => board[idx] === player)) {
      pattern.forEach((idx) => {
        document
          .querySelector(`[data-index='${idx}']`)
          .classList.add("win-cell");
      });
    }
  });
}

// Check winner
function checkWinner(b, player) {
  return winPatterns.some((pattern) =>
    pattern.every((idx) => b[idx] === player)
  );
}

// Check draw
function isDraw(b) {
  return b.every((cell) => cell !== null);
}

// Minimax AI
function minimax(b, depth, isMaximizing) {
  if (checkWinner(b, ai)) return 10 - depth;
  if (checkWinner(b, human)) return depth - 10;
  if (isDraw(b)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    b.forEach((cell, i) => {
      if (!cell) {
        b[i] = ai;
        let score = minimax(b, depth + 1, false);
        b[i] = null;
        bestScore = Math.max(bestScore, score);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    b.forEach((cell, i) => {
      if (!cell) {
        b[i] = human;
        let score = minimax(b, depth + 1, true);
        b[i] = null;
        bestScore = Math.min(bestScore, score);
      }
    });
    return bestScore;
  }
}

// Find best move for AI
function findBestMove(b) {
  let bestScore = -Infinity;
  let move;
  b.forEach((cell, i) => {
    if (!cell) {
      b[i] = ai;
      let score = minimax(b, 0, false);
      b[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });
  return move;
}
