const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const modeBtn = document.getElementById('mode-btn');

let currentPlayer = 'X';
let gameActive = true;
let board = Array(9).fill('');
let aiEnabled = false; 

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]            
];


function checkWin() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      gameActive = false;
      status.textContent = `${currentPlayer} Wins!`;
      return true;
    }
  }
  if (!board.includes('')) {
    status.textContent = `It's a Draw!`;
    gameActive = false;
    return true;
  }
  return false;
}


function checkWinCondition(boardState, player) {
  return winCombos.some(combo => {
    return combo.every(index => boardState[index] === player);
  });
}


function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, idx) => val === '' ? idx : null)
    .filter(i => i !== null);

  if (checkWinCondition(newBoard, 'X')) {
    return { score: -10 };
  } else if (checkWinCondition(newBoard, 'O')) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === 'O') {
      let result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      let result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}


function aiMove() {
  if (!gameActive) return;

  const bestSpot = minimax(board.slice(), 'O').index;

  board[bestSpot] = currentPlayer;
  cells[bestSpot].textContent = currentPlayer;

  if (!checkWin()) {
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}


function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;


  if (aiEnabled && currentPlayer === 'O') return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (!checkWin()) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;

    if (aiEnabled && currentPlayer === 'O') {

      setTimeout(aiMove, 400);
    }
  }
}


function resetGame() {
  board.fill('');
  cells.forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  gameActive = true;
  status.textContent = `Player ${currentPlayer}'s turn`;

  if (aiEnabled && currentPlayer === 'O') {
    setTimeout(aiMove, 400);
  }
}


function toggleMode() {
  aiEnabled = !aiEnabled;
  resetGame();
  modeBtn.textContent = aiEnabled ? 'Switch to User vs User' : 'Switch to AI Opponent';
}


cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
modeBtn.addEventListener('click', toggleMode);


status.textContent = `Player ${currentPlayer}'s turn`;
modeBtn.textContent = 'Switch to AI Opponent';
