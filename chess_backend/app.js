
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: 'http://localhost:5173'
}));

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.get("/", (req, res) => {
  res.send("Chess Game Backend is running.");
});

io.on("connection", function (uniquesocket) {
  console.log("connected");

  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
  } else {
    uniquesocket.emit("spectatorRole");
  }

  uniquesocket.on("disconnect", function () {
    if (uniquesocket.id === players.white) {
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      delete players.black;
    }
  });

  uniquesocket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
      if (chess.turn() === "b" && uniquesocket.id !== players.black) return;
  
      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid move:", move);
        uniquesocket.emit("InvalidMove", move);
      }
    } catch (err) {
      console.log(err);
      uniquesocket.emit("Invalid move: ", move);
    }
  });
  
});

server.listen(3000, function () {
  console.log("server is running on port 3000");
});
