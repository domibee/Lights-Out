import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board 
 * - ncols: number of cols of board 
 * - chanceLightStartsOn: float, chance any cell is lit at start of game (refer to the 8-ball)
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *1
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/


function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.35}) {
  // const nrows = props.nrows || 3;
  // const ncols = props.ncols || 3;
  // const chanceLightStartsOn = props.chanceLightStartsOn || 0.35;

  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    //**nested loop structure to create a 2d array by  looping  the rows then within each row you loop through columns which builds the grid one row at a time
    //iterates over  the rows and continues until y is less than the number of rows
    for (let y = 0; y < nrows; y++){
      let row = []; // a new row array is created for each  y value
      for( let x = 0; x < ncols; x++){ // iterates over columns and conts until 'x' is less than number of columns
        row.push(Math.random()<chanceLightStartsOn) // if random value is less than `chanceLightStartsOn then cell lit will be true otherwise it will be false
      }
      initialBoard.push(row); //row is pused once  fully populated 
    }
    return initialBoard;
  }

  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      console.log("COORD =====> ", coord); // coord is a string that reps the coordinates of a cell on the board.
      const [y, x] = coord.split("-").map(Number);
      console.log(y, x)

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const deepCopy = [...oldBoard];
    
      // in the copy, flip this cell and the cells around it
      flipCell(y, x, deepCopy);
      flipCell(y,x-1, deepCopy);
      flipCell(y,x+1,deepCopy);
      flipCell(y-1,x,deepCopy);
      flipCell(y+1,x,deepCopy);

      return deepCopy;
    });
  }

  if (hasWon()) {
    return <div>You Win!</div>;
  };
  
  let tableBoard = []; //empty array that holds the rows of the table
   
  for(let y = 0; y < nrows; y++){ //loops over the rows of the board
    let row = []; //for each y an empty array row is made and will hold the individual cells
    for(let x = 0; x < ncols; x++){ // iterates over columns of the board 
      let coord = `${y} - ${x}`; //coord generates a unique coord sttring for each ceell 
      row.push( //for each x a Cell component is created and pushed into the row array it is given the coordinate string, boolean of whether a cell is initially lit or not and prop to flip cells around specified coordinate when called. 
        <Cell key = {coord} 
        isLit={board[y][x]}
        flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    tableBoard.push(<tr key = {y}>{row}</tr>)
  }

  return (
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  )
}

export default Board;
