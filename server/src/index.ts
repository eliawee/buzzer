import { createServer } from "http";
import { Server, Socket } from "socket.io";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let broadcastMessages = [
  "broadcast accept player",
  "broadcast lobby",
  "broadcast game start",
  "broadcast sync game state",
];

let requestMessages = [
  "request join game",
  "request lobby",
  "request nickname update",
  "request buzz",
];

function forwardMessages(gameId: string, socket: Socket, messages: string[]) {
  messages.forEach((message) => {
    socket.on(message, (data) => io.to(gameId).emit(message, data));
  });
}

io.on("connection", async (socket: Socket) => {
  socket.on("create game", () => {
    let gameId = uid.rnd();

    forwardMessages(gameId, socket, broadcastMessages);
    forwardMessages(gameId, socket, requestMessages);

    socket.join(gameId);
    socket.emit("game created", { gameId });
  });

  socket.on("join game", ({ gameId }: { gameId: string }) => {
    forwardMessages(gameId, socket, requestMessages);
    socket.join(gameId);
    io.to(gameId).emit("request join game", { playerId: socket.id });
  });
});

httpServer.listen(3001, () => console.log("server started"));
