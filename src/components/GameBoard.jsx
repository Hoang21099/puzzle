/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import tuanlocLogo from "../assets/tuanloc.svg";
import leafLogo from "../assets/leaf.svg";
import giftLogo from "../assets/gift.svg";
import bellLogo from "../assets/bell.svg";
import cupLogo from "../assets/cup.svg";
import soundClick from "../assets/click.mp3";
import useSound from "use-sound";
import congrats from "../assets/congrat.mp3";
import SANTA from "../assets/SANTA.svg";

import Question from "../assets/question.svg";
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import Modal from "./Modal";
const GameBoard = ({
  size = 20,
  gifts = 10,
  questions = 5,
  obstacles = 10,
}) => {
  const [board, setBoard] = useState([]);
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [steps, setSteps] = useState(3);
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [remainingGifts, setRemainingGifts] = useState(gifts);
  const [currentGiftPosition, setCurrentGiftPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [play] = useSound(soundClick);
  const [playCongrats] = useSound(congrats);

  useEffect(() => {
    initializeBoard();

    // const handleKeyDown = (event) => {
    //   switch (event.key) {
    //     case "ArrowUp":
    //       handleMove("up");
    //       break;
    //     case "ArrowDown":
    //       handleMove("down");
    //       break;
    //     case "ArrowLeft":
    //       handleMove("left");
    //       break;
    //     case "ArrowRight":
    //       handleMove("right");
    //       break;
    //     default:
    //       break;
    //   }
    // };

    // window.addEventListener("keydown", handleKeyDown);
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    // };
  }, [size, gifts, questions, obstacles]);

  const initializeBoard = () => {
    const newBoard = Array(size)
      .fill()
      .map(() => Array(size).fill(null));
    placeItems(newBoard, "gift", gifts);
    placeItems(newBoard, "question", questions);
    placeObstacles(newBoard, obstacles);
    setBoard(newBoard);
    setVisitedCells(new Set(["0,0"]));
    setRemainingGifts(gifts);
  };

  const placeItems = (board, type, count) => {
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!board[x][y] && !(x === 0 && y === 0)) {
        board[x][y] = type;
        placed++;
      }
    }
  };

  const placeObstacles = (board, count) => {
    const logos = [tuanlocLogo, leafLogo, bellLogo, cupLogo];
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!board[x][y] && !(x === 0 && y === 0)) {
        board[x][y] = logos[Math.floor(Math.random() * logos.length)];
        placed++;
      }
    }
  };

  const handleMove = (direction) => {
    if (steps <= 0) return;

    play();

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

    const nextCell = board[newX][newY];

    if (
      nextCell === tuanlocLogo ||
      nextCell === leafLogo ||
      nextCell === bellLogo ||
      nextCell === cupLogo
    ) {
      const answer = prompt(
        "Solve this question to move to the obstacle: 2 + 2 = ?"
      );
      if (answer !== "4") {
        alert("Wrong answer! You cannot move to the obstacle.");
        return; // Prevent moving to obstacle positions if the answer is wrong
      }
    }

    setPlayerPosition([newX, newY]);
    setSteps(steps - 1);
    setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));

    if (nextCell === "question") {
      handleQuestion(newX, newY);
    } else if (nextCell === "gift") {
      setCurrentGiftPosition([newX, newY]);
      setIsModalOpen(true);
    }

    if (!(steps - 1)) {
      handleQuestion(newX, newY);
    }
  };

  // const handleMove = (direction) => {
  //   if (steps <= 0) return;

  //   play();

  //   const [x, y] = playerPosition;
  //   let newX = x,
  //     newY = y;

  //   switch (direction) {
  //     case "up":
  //       newX = x > 0 ? x - 1 : x;
  //       break;
  //     case "down":
  //       newX = x < size - 1 ? x + 1 : x;
  //       break;
  //     case "left":
  //       newY = y > 0 ? y - 1 : y;
  //       break;
  //     case "right":
  //       newY = y < size - 1 ? y + 1 : y;
  //       break;
  //     default:
  //       break;
  //   }

  //   if (
  //     board[newX][newY] === tuanlocLogo ||
  //     board[newX][newY] === leafLogo ||
  //     board[newX][newY] === bellLogo ||
  //     board[newX][newY] === cupLogo
  //   ) {
  //     return; // Prevent moving to obstacle positions
  //   }

  //   setPlayerPosition([newX, newY]);
  //   setSteps(steps - 1);
  //   setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));

  //   if (board[newX][newY] === "question") {
  //     handleQuestion(newX, newY);
  //   } else if (board[newX][newY] === "gift") {
  //     // collectGift(newX, newY);
  //     setCurrentGiftPosition([newX, newY]);
  //     setIsModalOpen(true);
  //   }

  //   if (!(steps - 1)) {
  //     handleQuestion(newX, newY);
  //   }
  // };

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

  const handlePuzzleComplete = () => {
    setIsModalOpen(false);
    const [x, y] = currentGiftPosition;
    const newBoard = [...board];
    newBoard[x][y] = null;
    setBoard(newBoard);
    setRemainingGifts(remainingGifts - 1);
    collectGift(x, y);
  };

  const collectGift = (x, y) => {
    const newBoard = [...board];
    newBoard[x][y] = null;
    setBoard(newBoard);
    setRemainingGifts(remainingGifts - 1);
    playCongrats();
  };

  useEffect(() => {
    if (
      steps <= 0 &&
      board[playerPosition[0]][playerPosition[1]] === "question"
    ) {
      handleQuestion(playerPosition[0], playerPosition[1]);
    }
  }, [steps, playerPosition]);

  const renderControl = () => (
    <div className="flex flex-col items-center mt-4">
      <div className="flex">
        <button
          onClick={() => handleMove("up")}
          className="bg-green-500 text-white font-bold text-xl px-8 py-4 m-2 rounded-full shadow-lg hover:bg-green-600 transition duration-200 transform hover:scale-105"
        >
          ↑
        </button>
      </div>
      <div className="flex">
        <button
          onClick={() => handleMove("left")}
          className="bg-blue-500 text-white font-bold text-xl px-8 py-4 m-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
        >
          ←
        </button>
        <button
          onClick={() => handleMove("right")}
          className="bg-blue-500 text-white font-bold text-xl px-8 py-4 m-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
        >
          →
        </button>
      </div>
      <div className="flex">
        <button
          onClick={() => handleMove("down")}
          className="bg-green-500 text-white font-bold text-xl px-8 py-4 m-2 rounded-full shadow-lg hover:bg-green-600 transition duration-200 transform hover:scale-105"
        >
          ↓
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex gap-3">
      <div className="grid grid-cols-custom gap-0.5">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="w-[500px] h-[500px]">
            <JigsawPuzzle
              imageSrc="https://2sao.vietnamnetjsc.vn/images/2024/11/01/19/59/em-be-nin-3.jpg"
              rows={2}
              columns={2}
              onSolved={() => handlePuzzleComplete()}
            />
          </div>
        </Modal>

        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (cell === cupLogo) {
              return (
                <img
                  key={`${rowIndex}-${colIndex}`}
                  src={cupLogo}
                  alt="cupLogo"
                  className="w-[80px] h-[80px]"
                />
              );
            } else if (cell === tuanlocLogo) {
              return (
                <img
                  key={`${rowIndex}-${colIndex}`}
                  src={tuanlocLogo}
                  alt="TuanLoc"
                  className="w-[80px] h-[80px]"
                />
              );
            } else if (cell === leafLogo) {
              return (
                <img
                  key={`${rowIndex}-${colIndex}`}
                  src={leafLogo}
                  alt="Leaf"
                  className="w-[80px] h-[80px]"
                />
              );
            } else if (cell === bellLogo) {
              return (
                <img
                  key={`${rowIndex}-${colIndex}`}
                  src={bellLogo}
                  alt="Bell"
                  className="w-[80px] h-[80px]"
                />
              );
            } else {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-[80px] h-[80px] border ${
                    playerPosition[0] === rowIndex &&
                    playerPosition[1] === colIndex
                      ? "bg-blue-500"
                      : visitedCells.has(`${rowIndex},${colIndex}`)
                      ? "bg-yellow-300"
                      : "bg-gray-200"
                  }`}
                >
                  {playerPosition[0] === rowIndex &&
                    playerPosition[1] === colIndex && (
                      <img
                        src={SANTA}
                        alt="Santa"
                        className="w-[80px] h-[80px]"
                      />
                    )}
                  {cell === "gift" && (
                    <img
                      src={giftLogo}
                      alt="Gift"
                      className="w-[80px] h-[80px]"
                    />
                  )}
                  {cell === "question" && <img src={Question} />}
                </div>
              );
            }
          })
        )}
      </div>

      <div className="flex items-center flex-col gap-4">
        <div className="mt-4 flex flex-col gap-4">
          <p className="bg-green-500 text-white rounded-xl p-3   ">
            Total Gifts Remaining: {remainingGifts}
          </p>
          <p>Step Remaining: {steps}</p>
        </div>
        {renderControl()}
      </div>
    </div>
  );
};

export default GameBoard;
