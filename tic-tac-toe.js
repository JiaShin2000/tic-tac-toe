const Gameboard = function () {
  const gameboard = ["", "", "", "", "", "", "", "", ""];
  const winningBoard = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //columns
    [0, 4, 8],
    [2, 4, 6],
  ]; //diagonal

  const getBoard = () => gameboard;

  const placeMarker = (index, marker) => {
    if (gameboard[index] === "") {
      gameboard[index] = marker;
      console.log(`Marker placed at ${index}:`, gameboard);
      return true;
    }
    return false;
  };

  function checkWinner() {
    for (let combo of winningBoard) {
      const [a, b, c] = combo;

      if (
        gameboard[a] &&
        gameboard[a] === gameboard[b] &&
        gameboard[a] === gameboard[c]
      ) {
        return gameboard[a];
      }
    }

    return null;
  }

  function checkTie() {
    return gameboard.every((cell) => cell !== "") && !checkWinner();
  }

  function resetBoard() {
    gameboard.fill("");
  }

  return { getBoard, placeMarker, checkWinner, checkTie, resetBoard };
};

//factory function
const createPlayer = (name, marker) => {
  return { name, marker };
};

//Game controller module
function GameController(playerOne = "Player 1", playerTwo = "Player 2") {
  const board = Gameboard();
  const player1 = createPlayer(playerOne, "X");
  const player2 = createPlayer(playerTwo, "O");

  let activePlayer = player1;

  //switch turns between players
  const switchTurns = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const playTurn = (index) => {
    if (board.placeMarker(index, getActivePlayer().marker)) {
      console.log(`Placing ${getActivePlayer()}'s marker into ${index}`);
      const winner = board.checkWinner();

      if (winner) {
        console.log(`${winner} wins!`);
        return;
      }

      if (board.checkTie()) {
        console.log("It's a tie!");
        return;
      }

      switchTurns();
    }
  };

  return { playTurn, getActivePlayer, switchTurns, board };
}

//render UI
const displayController = () => {
  const gameboard = document.querySelector(".gameboard");
  const gameStatus = document.querySelector(".game-status");

  //create a game instance
  const game = GameController();

  function createBoard() {
    gameboard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const button = document.createElement("button");
      button.dataset.index = i; //store index in dataset

      button.addEventListener("click", handleMove);
      gameboard.appendChild(button);
    }
  }

  function handleMove(event) {
    const index = event.target.dataset.index;
    const activePlayer = game.getActivePlayer();
    if (game.board.placeMarker(index, activePlayer.marker)) {
      //event.target.textContent = activePlayer.marker;
      updateBoard();
      if (checkGameState()) return;
      game.switchTurns();
      gameStatus.textContent = `${activePlayer.name}'s turn:`;
    }
  }

  function updateBoard() {
    const buttons = document.querySelectorAll(".gameboard button");

    buttons.forEach((button, index) => {
      button.textContent = game.board.getBoard()[index];
    });
  }

  function checkGameState() {
    const winner = game.board.checkWinner();
    const tie = game.board.checkTie();

    if (winner) {
      gameStatus.textContent = `${
        winner === "X" ? "Player 1" : "Player 2"
      } wins!`;
      disableBoard();
      resetBtn.style.display = "block";
      return true;
    }

    if (tie) {
      gameStatus.textContent = `It's a tie!`;
      disableBoard();
      resetBtn.style.display = "block";
      return true;
    }
    return false;
  }

  function disableBoard() {
    document
      .querySelectorAll(".gameboard button")
      .forEach((button) => (button.disabled = true));
  }

  function resetGame() {
    game.board.resetBoard();
    gameStatus.textContent = "";
    gameboard.innerHTML = "";
    resetBtn.style.display = "none";
    createBoard();
    updateBoard();
  }

  const resetBtn = document.createElement("button");
  const buttonMenu = document.querySelector(".button-menu");
  resetBtn.classList.add("reset-btn");
  resetBtn.textContent = "RESET";
  resetBtn.style.display = "none";
  buttonMenu.appendChild(resetBtn);
  resetBtn.addEventListener("click", resetGame);

  createBoard();
};

displayController();
