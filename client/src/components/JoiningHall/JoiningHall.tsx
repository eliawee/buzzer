import { connect, Socket } from "socket.io-client";
import "./JoiningHall.css";
import { useEffect, useReducer } from "react";
import { LobbySyncedState } from "../Lobby/Lobby";

type State = {
  gameId: string;
  joining: boolean;
  socket?: Socket;
};

enum ActionType {
  ConnectionRequest,
  JoiningRequest,
  JoiningConfirmation,
  LobbyRequest,
}

type ConnectionRequestAction = {
  actionType: ActionType.ConnectionRequest;
};

type JoiningRequestAction = {
  actionType: ActionType.JoiningRequest;
  socket: Socket;
};

type JoiningConfirmationAction = {
  actionType: ActionType.JoiningConfirmation;
  socket: Socket;
};

type LobbyRequestAction = {
  actionType: ActionType.LobbyRequest;
};

type Action =
  | ConnectionRequestAction
  | JoiningRequestAction
  | JoiningConfirmationAction
  | LobbyRequestAction;

type JoiningHallProps = {
  gameId: string;
  onGameJoined: (
    socket: Socket,
    gameId: string,
    lobby: LobbySyncedState
  ) => any;
};

function reducer(state: State, action: Action) {
  switch (action.actionType) {
    case ActionType.ConnectionRequest:
      let socket = connect("http://localhost:3001");

      return { ...state, socket };
    case ActionType.JoiningRequest:
      action.socket.emit("join game", { gameId: state.gameId });

      return { ...state, joining: true };
    case ActionType.JoiningConfirmation:
      action.socket.emit("request lobby", {});
      return state;
    default:
      return state;
  }
}

export default function JoiningHall({
  gameId,
  onGameJoined,
}: JoiningHallProps) {
  let [state, dispatch] = useReducer(reducer, { gameId, joining: false });

  useEffect(() => {
    let { socket } = state;

    if (!socket) {
      dispatch({ actionType: ActionType.ConnectionRequest });
    } else if (!state.joining) {
      socket.on(
        "broadcast accept player",
        ({ playerId }: { playerId: string }) => {
          if (socket && socket.id && playerId == socket.id) {
            dispatch({ actionType: ActionType.JoiningConfirmation, socket });
          }
        }
      );

      socket.on("broadcast lobby", (lobby: LobbySyncedState) => {
        if (socket) {
          socket.off("broadcast lobby");
          socket.off("broadcast accept player");

          onGameJoined(socket, gameId, lobby);
        }
      });

      dispatch({ actionType: ActionType.JoiningRequest, socket });
    }
  });

  return <div>Joining</div>;
}
