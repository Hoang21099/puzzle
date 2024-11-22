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
import SANTA from "../assets/sep.webp";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Question from "../assets/question.svg";
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import Modal from "./Modal";
import useConfetti from "../hooks/useConfetti";

const randomGifts = [
  "https://www.shutterstock.com/image-photo/beautiful-young-woman-holding-gift-600nw-2143987771.jpg",
  "https://st2.depositphotos.com/1875497/6131/i/450/depositphotos_61312019-stock-photo-christmas-gift-box.jpg",
];

const randomQuestions = [
  { id: 6, question: "Is Tokyo the capital of Japan?", answer: "Yes" },
  {
    id: 7,
    question: "Is Russia the largest country in the world by land area?",
    answer: "Yes",
  },
  {
    id: 8,
    question: "Did Leonardo da Vinci paint the Mona Lisa?",
    answer: "Yes",
  },
  { id: 9, question: "Is Au the chemical symbol for gold?", answer: "Yes" },
  { id: 10, question: "Are giraffes the tallest land animals?", answer: "Yes" },
  {
    id: 11,
    question: "Is Venus the hottest planet in our solar system?",
    answer: "Yes",
  },
  {
    id: 12,
    question: "Did J.K. Rowling write the Harry Potter series?",
    answer: "Yes",
  },
  {
    id: 13,
    question: "Is the Pacific Ocean the largest ocean on Earth?",
    answer: "Yes",
  },
  {
    id: 14,
    question: "Is Washington, D.C. the capital of the United States?",
    answer: "Yes",
  },
  {
    id: 15,
    question: "Is Mount Everest the tallest mountain in the world?",
    answer: "Yes",
  },
];

const GameBoard = ({
  size = 20,
  gifts = 10,
  questions = 5,
  obstacles = 10,
}) => {
  const { isConfettiVisible, toggleConfetti } = useConfetti();

  const [board, setBoard] = useState([]);
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [steps, setSteps] = useState(3);
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [remainingGifts, setRemainingGifts] = useState(gifts);
  const [currentGiftPosition, setCurrentGiftPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [play] = useSound(soundClick);
  const [playCongrats] = useSound(congrats);

  const { width, height } = useWindowSize();

  useEffect(() => {
    initializeBoard();
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

    if (
      board[newX][newY] === tuanlocLogo ||
      board[newX][newY] === leafLogo ||
      board[newX][newY] === bellLogo ||
      board[newX][newY] === cupLogo
    ) {
      return; // Prevent moving to obstacle positions
    }

    setPlayerPosition([newX, newY]);
    setSteps(steps - 1);
    setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));

    if (board[newX][newY] === "question") {
      handleQuestion(newX, newY);
    } else if (board[newX][newY] === "gift") {
      // collectGift(newX, newY);
      setCurrentGiftPosition([newX, newY]);
      setIsModalOpen(true);
    }

    if (!(steps - 1)) {
      handleQuestion(newX, newY);
    }
  };

  const handleQuestion = (x, y) => {
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    const randomQuestion = randomQuestions[randomIndex];

    const answer = prompt(randomQuestion.question);
    if (answer === randomQuestion.answer) {
      setSteps(steps + 3);
      const newBoard = [...board];
      newBoard[x][y] = null;
      setBoard(newBoard);
    } else {
      alert("Wrong answer!");
    }
  };

  const handleGetLinkGift = () => {
    const randomIndex = Math.floor(Math.random() * randomGifts.length);
    return randomGifts[randomIndex];
  };

  const handlePuzzleComplete = () => {
    setIsModalOpen(false);
    const [x, y] = currentGiftPosition;
    const newBoard = [...board];
    newBoard[x][y] = null;
    setBoard(newBoard);
    setRemainingGifts(remainingGifts - 1);
    collectGift(x, y);
    toggleConfetti();
    setIsSuccessOpen(true);
    setTimeout(() => toggleConfetti(), 2000);
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

  const renderSuccess = () => {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl text-green-500">Congratulations!</h2>
        <p>You have collected all the gifts!</p>
      </div>
    );
  };

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

        <Modal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}>
          <div className="w-[500px] h-[500px] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4">
            <img
              src={handleGetLinkGift()}
              className="w-full h-auto rounded-lg mb-4"
              alt="Congratulations on your achievement!"
            />
            <button
              onClick={() => setIsSuccessOpen(false)} // Replace with your desired action
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              OK
            </button>
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
                      ? "bg-red-200 rounded-full"
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

      {isConfettiVisible && <Confetti width={width} height={height} />}
    </div>
  );
};

export default GameBoard;
