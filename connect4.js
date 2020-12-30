/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // Create top row and give all elements in this row the handleClick listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Create a "head cell" for each column in the top row and append the row to the top of the board
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Then create the game board itself. Create table rows up to the value of HEIGHT, and cells in each row up to the value of WIDTH. Cell ID will be equal to the (y, x) coordinate of the cell
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let highestEmptyRow = null;
  for (let row of board) {
    if (row[x] === null) {
      highestEmptyRow = board.indexOf(row);
    }
  }
  return highestEmptyRow;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  //Make a div, give it a class of piece and the current player, and insert into the table cell with the ID of the coordinates passed
  const piece = document.createElement('div');
  piece.className = `piece p${currPlayer}`;
  document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  //Add player number to JS array board where piece was placed
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check if all cells in board are filled; if so call, call endGame with a tie
  if (board.every(row => row.every(cell => cell !== null))) {
    return endGame("Tie game!");
  }

  // switch players if the game is continuing
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //Check every row and column of the board to see if either player has won yet
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //Create four arrays of coordinate pairs representing possible winning scenarios starting from the current x and y coordinates
      //Check four cells to the right of the current cell
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //Check four cells above the current cell
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //Check four cells moving diagonally towards the bottom right from the current cell
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //Check four cells moving diagonally towards the bottom left from the current cell
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //If win returns true for any of the scenarios starting from the current cell, someone has won the game
      if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
