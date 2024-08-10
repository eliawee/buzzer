import { Socket, connect } from "socket.io-client";
import { useEffect, useReducer } from "react";
import BuzzerContainer from "../common/Container";
import { Button, Stack, Typography } from "@mui/material";

type State = {
  socket?: Socket;
  waitingForGameCreation: boolean;
  socketInitialized: boolean;
  gameId?: string;
};

enum ActionType {
  GameCreationRequest,
  SocketInitialization,
  GameCreationConfirmation,
}

type GameCreationRequestAction = {
  actionType: ActionType.GameCreationRequest;
};

type SocketInitializationAction = {
  actionType: ActionType.SocketInitialization;
};

type GameCreationConfirmationAction = {
  actionType: ActionType.GameCreationConfirmation;
  gameId: string;
};

type Action =
  | GameCreationRequestAction
  | SocketInitializationAction
  | GameCreationConfirmationAction;

function reducer(state: State, action: Action) {
  switch (action.actionType) {
    case ActionType.GameCreationRequest:
      let socket = connect("http://localhost:3001");

      socket.emit("create game");

      return { ...state, socket, waitingForGameCreation: true };
    case ActionType.SocketInitialization:
      return { ...state, socketInitialized: true };
    case ActionType.GameCreationConfirmation:
      return { ...state, gameId: action.gameId };
    default:
      return state;
  }
}

let createGameRequest =
  (state: State, dispatch: React.Dispatch<Action>) => () => {
    if (!state.waitingForGameCreation) {
      dispatch({ actionType: ActionType.GameCreationRequest });
    }
  };

export default ({ onGameCreated }: IProps) => {
  let [state, dispatch] = useReducer(reducer, {
    waitingForGameCreation: false,
    socketInitialized: false,
  });
  let { socket } = state;

  useEffect(() => {
    if (socket && !state.socketInitialized) {
      socket.on("game created", ({ gameId }: { gameId: string }) => {
        dispatch({ actionType: ActionType.GameCreationConfirmation, gameId });
      });

      dispatch({ actionType: ActionType.SocketInitialization });
    }

    if (socket && state.gameId) {
      onGameCreated(socket, state.gameId);
      socket.off("game created");
    }
  });

  return (
    <BuzzerContainer>
      <Stack spacing={2}>
        <Typography variant="h5" textAlign="center">
          Um, actually
        </Typography>
        <Button
          variant="contained"
          disabled={state.waitingForGameCreation}
          onClick={createGameRequest(state, dispatch)}
        >
          Nouvelle Partie
        </Button>
      </Stack>
    </BuzzerContainer>
  );
};

type IProps = {
  onGameCreated: (socket: Socket, gameId: string) => void;
};
