// src/hooks/useConfetti.js
import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const useConfetti = () => {
  const { width, height } = useWindowSize();
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);

  const toggleConfetti = () => {
    setIsConfettiVisible(!isConfettiVisible);
  };

  const ConfettiComponent = isConfettiVisible
    ? null //  <Confetti width={width} height={height} />
    : null;

  return { isConfettiVisible, toggleConfetti };
};

export default useConfetti;
