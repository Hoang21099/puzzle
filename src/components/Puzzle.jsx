// src/components/Puzzle.js
import React, { useState } from "react";

const Puzzle = ({ onComplete }) => {
  const [pieces, setPieces] = useState(
    [...Array(9).keys()].sort(() => Math.random() - 0.5)
  );
  const [isSolved, setIsSolved] = useState(false);

  const handlePieceClick = (index) => {
    // Implement puzzle logic here
    // For simplicity, let's assume the puzzle is solved when the pieces are in order
    const newPieces = [...pieces];
    [newPieces[index], newPieces[index + 1]] = [
      newPieces[index + 1],
      newPieces[index],
    ];
    setPieces(newPieces);

    if (newPieces.every((piece, i) => piece === i)) {
      setIsSolved(true);
      onComplete();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-gray-300 flex items-center justify-center cursor-pointer"
            onClick={() => handlePieceClick(index)}
          >
            {piece + 1}
          </div>
        ))}
      </div>
      {isSolved && <p className="mt-4 text-green-500">Puzzle Solved!</p>}
    </div>
  );
};

export default Puzzle;
