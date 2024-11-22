// /* eslint-disable react/prop-types */
// // src/components/GameBoard.js

// src/components/GameBoard.js
import React, { useState, useEffect, useRef } from "react";
// import useFireworks from "../hooks/useFirework";

const GameBoard = ({ size = 20, gifts = 10, questions = 5 }) => {
  const ref = useRef(null);
  // const { FireworksComponent, toggleFireworks } = useFireworks();

  const [board, setBoard] = useState([]);
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [steps, setSteps] = useState(3);
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [remainingGifts, setRemainingGifts] = useState(gifts);

  useEffect(() => {
    initializeBoard();

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [size, gifts, questions]);

  const initializeBoard = () => {
    const newBoard = Array(size)
      .fill()
      .map(() => Array(size).fill(null));
    placeItems(newBoard, "gift", gifts);
    placeItems(newBoard, "question", questions);
    setBoard(newBoard);
    setVisitedCells(new Set(["0,0"]));
    setRemainingGifts(gifts);
  };

  const placeItems = (board, type, count) => {
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!board[x][y]) {
        board[x][y] = type;
        placed++;
      }
    }
  };

  const handleMove = (direction) => {
    ref.current.stop();
    if (steps <= 0) return;

    const [x, y] = playerPosition;
    let newX = x,
      newY = y;

    switch (direction) {
      case "up":
        newX = x > 0 ? x - 1 : x;
        break;
      case "down":
        newX = x < size - 1 ? x + 1 : x;
        break;
      case "left":
        newY = y > 0 ? y - 1 : y;
        break;
      case "right":
        newY = y < size - 1 ? y + 1 : y;
        break;
      default:
        break;
    }

    setPlayerPosition([newX, newY]);
    setSteps(steps - 1);
    setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));

    if (board[newX][newY] === "question") {
      handleQuestion(newX, newY);
    } else if (board[newX][newY] === "gift") {
      collectGift(newX, newY);
    }

    if (!(steps - 1)) {
      handleQuestion(newX, newY);
    }
  };

  const handleQuestion = (x, y) => {
    const answer = prompt("Solve this question: 2 + 2 = ?");
    if (answer === "4") {
      setSteps(steps + 3);
      const newBoard = [...board];
      newBoard[x][y] = null;
      setBoard(newBoard);
    } else {
      alert("Wrong answer!");
    }
  };

  const collectGift = (x, y) => {
    const newBoard = [...board];
    newBoard[x][y] = null;
    setBoard(newBoard);
    setRemainingGifts(remainingGifts - 1);
    toggleFireworks();
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        handleMove("up");
        break;
      case "ArrowDown":
        handleMove("down");
        break;
      case "ArrowLeft":
        handleMove("left");
        break;
      case "ArrowRight":
        handleMove("right");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (
      steps <= 0 &&
      board[playerPosition[0]][playerPosition[1]] === "question"
    ) {
      handleQuestion(playerPosition[0], playerPosition[1]);
    }
  }, [steps, playerPosition]);

  return (
    <div>
      <div className="grid grid-cols-custom gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 border ${
                playerPosition[0] === rowIndex && playerPosition[1] === colIndex
                  ? "bg-blue-500"
                  : visitedCells.has(`${rowIndex},${colIndex}`)
                  ? "bg-yellow-300"
                  : "bg-gray-200"
              }`}
            >
              {cell === "gift" && "🎁"}
              {cell === "question" && "❓"}
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => handleMove("up")}
          className="bg-gray-700 text-white px-4 py-2 m-1"
        >
          Up
        </button>
        <button
          onClick={() => handleMove("down")}
          className="bg-gray-700 text-white px-4 py-2 m-1"
        >
          Down
        </button>
        <button
          onClick={() => handleMove("left")}
          className="bg-gray-700 text-white px-4 py-2 m-1"
        >
          Left
        </button>
        <button
          onClick={() => handleMove("right")}
          className="bg-gray-700 text-white px-4 py-2 m-1"
        >
          Right
        </button>
      </div>

      <div className="mt-4">
        <p>Total Gifts Remaining: {remainingGifts}</p>
      </div>
    </div>
  );
};

export default GameBoard;
