// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2">
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
