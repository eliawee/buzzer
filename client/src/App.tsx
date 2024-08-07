import { Socket } from "socket.io-client";
import Landing from "./components/Landing/Landing";
import { useEffect, useReducer } from "react";
import JoiningHall from "./components/JoiningHall/JoiningHall";
import Lobby, { LobbySyncedState } from "./components/Lobby/Lobby";
import Game from "./components/Game/Game";
import { SyncedGameState } from "./types";
import Transmitter from "./Transmitter";

enum StateType {
  Landed,
  CreatedGame,
  JoinedGame,
  StartedGame,
}

type LandedState = {
  stateType: StateType.Landed;
};

type CreatedGameState = {
  stateType: StateType.CreatedGame;
  socket: Socket;
  gameId: string;
};

type JoinedGameState = {
  stateType: StateType.JoinedGame;
  socket: Socket;
  gameId: string;
  lobby: LobbySyncedState;
};

type StartedGameState = {
  stateType: StateType.StartedGame;
  socket: Socket;
  host: boolean;
  game: SyncedGameState;
};

type State =
  | LandedState
  | CreatedGameState
  | JoinedGameState
  | StartedGameState;

enum ActionType {
  GameCreation,
  GameJoining,
  GameStart,
}

type GameCreationAction = {
  actionType: ActionType.GameCreation;
  socket: Socket;
  gameId: string;
};

type GameJoiningAction = {
  actionType: ActionType.GameJoining;
  socket: Socket;
  gameId: string;
  lobby: LobbySyncedState;
};

type GameStartAction = {
  actionType: ActionType.GameStart;
  socket: Socket;
  host: boolean;
  game: SyncedGameState;
};

type Action = GameCreationAction | GameJoiningAction | GameStartAction;

function reducer(state: State, action: Action) {
  switch (action.actionType) {
    case ActionType.GameCreation:
      window.history.pushState("lobby", "Lobby", `/${action.gameId}`);

      let createdGameState: CreatedGameState = {
        stateType: StateType.CreatedGame,
        gameId: action.gameId,
        socket: action.socket,
      };

      return createdGameState;
    case ActionType.GameJoining:
      window.history.pushState("lobby", "Lobby", `/${action.gameId}`);

      let joinedGameState: JoinedGameState = {
        stateType: StateType.JoinedGame,
        gameId: action.gameId,
        socket: action.socket,
        lobby: action.lobby,
      };

      return joinedGameState;
    case ActionType.GameStart:
      let gameStartedState: StartedGameState = {
        stateType: StateType.StartedGame,
        socket: action.socket,
        game: action.game,
        host: action.host,
      };

      return gameStartedState;
    default:
      return state;
  }
}

let onGameCreated =
  (state: State, dispatch: React.Dispatch<Action>) =>
  (socket: Socket, gameId: string) => {
    dispatch({ actionType: ActionType.GameCreation, socket, gameId });
  };

let onGameJoined =
  (state: State, dispatch: React.Dispatch<Action>) =>
  (socket: Socket, gameId: string, lobby: LobbySyncedState) => {
    dispatch({ actionType: ActionType.GameJoining, socket, gameId, lobby });
  };

let onGameStarted =
  (state: State, dispatch: React.Dispatch<Action>) =>
  (socket: Socket, host: boolean, game: SyncedGameState) => {
    dispatch({ actionType: ActionType.GameStart, socket, host, game });
  };

function App() {
  let [state, dispatch] = useReducer(reducer, { stateType: StateType.Landed });
  let requestedGameId = window.location.pathname.replace("/", "");
  let playerId =
    state.stateType != StateType.Landed ? state.socket.id : undefined;

  useEffect(() => {
    window.document.title = "Buzzer";
  }, []);

  return (
    <>
      {state.stateType == StateType.Landed && requestedGameId.length == 0 ? (
        <Landing onGameCreated={onGameCreated(state, dispatch)} />
      ) : null}

      {state.stateType == StateType.Landed && requestedGameId.length > 0 ? (
        <JoiningHall
          gameId={requestedGameId}
          onGameJoined={onGameJoined(state, dispatch)}
        />
      ) : null}

      {state.stateType == StateType.CreatedGame ? (
        <Lobby
          gameId={state.gameId}
          socket={state.socket}
          host={true}
          onGameStarted={onGameStarted(state, dispatch)}
        />
      ) : null}

      {state.stateType == StateType.JoinedGame ? (
        <Lobby
          gameId={state.gameId}
          socket={state.socket}
          host={false}
          initialLobby={state.lobby}
          onGameStarted={onGameStarted(state, dispatch)}
        />
      ) : null}

      {state.stateType == StateType.StartedGame && playerId != undefined ? (
        <Game
          playerId={playerId}
          transmitter={new Transmitter(state.socket)}
          host={state.host}
          initialSyncedState={state.game}
        />
      ) : null}
    </>
  );
}

export default App;
