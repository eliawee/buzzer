import { Socket } from "socket.io-client";
import { SyncedGameState } from "./types";

class Message<DataType> {
  socket: Socket;
  name: string;

  constructor(socket: Socket, name: string) {
    this.socket = socket;
    this.name = name;
  }

  on(handler: (data: DataType) => any) {
    this.socket.on(this.name, (data) => handler(data));
  }

  emit(data: DataType) {
    this.socket.emit(this.name, data);
  }

  off() {
    this.socket.off(this.name);
  }
}

export default class Transmitter {
  socket: Socket;

  broadcastGameState: Message<SyncedGameState>;
  requestBuzz: Message<{ playerId: string }>;

  constructor(socket: Socket) {
    this.socket = socket;

    this.broadcastGameState = new Message<SyncedGameState>(
      this.socket,
      "broadcast sync game state"
    );

    this.requestBuzz = new Message<{ playerId: string }>(
      this.socket,
      "request buzz"
    );
  }

  public reset() {
    this.broadcastGameState.off();
    this.requestBuzz.off();
  }
}
