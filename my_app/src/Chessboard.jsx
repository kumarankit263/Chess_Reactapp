

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import io from 'socket.io-client';
import './ChessBoard.css';

const socket = io('http://localhost:3000');

const ChessBoard = () => {
  const [chess, setChess] = useState(new Chess());
  const [playerRole, setPlayerRole] = useState(null);
  const [boardState, setBoardState] = useState(chess.board());

  useEffect(() => {
    socket.on('playerRole', (role) => {
      setPlayerRole(role);
    });

    socket.on('spectatorRole', () => {
      setPlayerRole(null);
    });

    socket.on('boardState', (fen) => {
      const newChess = new Chess(fen);
      setChess(newChess);
      setBoardState(newChess.board());
    });

    socket.on('move', (move) => {
      const newChess = new Chess(chess.fen());
      newChess.move(move);
      setChess(newChess);
      setBoardState(newChess.board());
    });

    return () => {
      socket.off('playerRole');
      socket.off('spectatorRole');
      socket.off('boardState');
      socket.off('move');
    };
  }, [chess]);

  const handleMove = (source, target) => {
    if (!source || !target) return;
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
      to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
      promotion: "q",
    };
    socket.emit("move", move);
  };

  const handleDragStart = (e, piece, row, col) => {
    e.dataTransfer.setData('piece', JSON.stringify({ piece, source: { row, col } }));
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const { source } = JSON.parse(e.dataTransfer.getData('piece'));
    handleMove(source, { row, col });
  };

  const getPieceUnicode = (piece) => {
    const unicodePieces = {
      p: "♙",
      r: "♖",
      n: "♘",
      b: "♗",
      q: "♕",
      k: "♔",
      P: "♟",
      R: "♜",
      N: "♞",
      B: "♝",
      Q: "♛",
      K: "♚",
    };
    return unicodePieces[piece.type] || "";
  };

  const getSquareClasses = (rowindex, squareindex) =>
    `square ${(rowindex + squareindex) % 2 === 0 ? 'light' : 'dark'}`;

  return (
    <div>
      <div className={`chessboard ${playerRole === 'b' ? 'flipped' : ''}`}>
        {boardState.map((row, rowindex) =>
          row.map((square, squareindex) => (
            <div
              key={`${rowindex}-${squareindex}`}
              className={getSquareClasses(rowindex, squareindex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, rowindex, squareindex)}
            >
              {square && (
                <div
                  className={`piece ${square.color === 'w' ? 'white' : 'black'}`}
                  draggable={square.color === playerRole}
                  onDragStart={(e) => handleDragStart(e, square, rowindex, squareindex)}
                >
                  {getPieceUnicode(square)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="status-message">
        {playerRole === "w" ? "Waiting for the opponent..." : 
         playerRole === "b" ? "Game Started! Enjoy the game!" : 
         "Spectators cannot participate in the game."}
      </div>
  </div>
  );
};

export default ChessBoard;
