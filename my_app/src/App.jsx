import React from 'react';
import ChessBoard from './Chessboard'; // Ensure the correct filename


const App = () => {
  return (
    <div className="App min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Chess Game</h1>
      <ChessBoard />
    </div>
  );
};

export default App;
