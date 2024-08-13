import React from 'react';
import './chessboard.css'; // Import your CSS for chessboard and pieces

const Piece = ({ piece, draggable, onDragStart }) => {
  const getPieceUnicode = (type) => {
    const unicodePieces = {
      p: '♙',
      r: '♖',
      n: '♘',
      b: '♗',
      q: '♕',
      k: '♔',
      P: '♟',
      R: '♜',
      N: '♞',
      B: '♝',
      Q: '♛',
      K: '♚',
    };
    return unicodePieces[type] || '';
  };

  return (
    <div
      className={`piece ${piece.color === 'w' ? 'white' : 'black'}`}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {getPieceUnicode(piece.type)}
    </div>
  );
};

export default Piece;
