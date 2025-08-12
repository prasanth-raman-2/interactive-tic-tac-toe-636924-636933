import React, { useState, useCallback } from 'react';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const getAIMove = (squares) => {
  // Simple AI: Look for first empty square
  const emptySquares = squares.reduce((acc, square, index) => {
    if (!square) acc.push(index);
    return acc;
  }, []);
  
  if (emptySquares.length === 0) return null;
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};

const Square = ({ value, onClick }) => (
  <button className={`square ${value}`} onClick={onClick}>
    {value}
  </button>
);

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAI, setVsAI] = useState(false);
  
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square);
  
  const handleClick = useCallback((i) => {
    if (calculateWinner(squares) || squares[i]) return;
    
    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    
    if (vsAI && !calculateWinner(newSquares)) {
      // AI's turn
      const aiMove = getAIMove(newSquares);
      if (aiMove !== null) {
        setTimeout(() => {
          newSquares[aiMove] = 'O';
          setSquares([...newSquares]);
        }, 500);
      }
    } else {
      setIsXNext(!isXNext);
    }
  }, [squares, isXNext, vsAI]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  const toggleMode = () => {
    setVsAI(!vsAI);
    resetGame();
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = vsAI 
      ? (isXNext ? "Your turn (X)" : "AI thinking...")
      : `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="game-container">
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
      <div className="controls">
        <button className="btn" onClick={resetGame}>
          Reset Game
        </button>
        <button className="btn accent" onClick={toggleMode}>
          {vsAI ? 'Two Players' : 'Play vs AI'}
        </button>
      </div>
    </div>
  );
};

export default Game;
