import { Socket } from "socket.io-client";
import { useEffect, useReducer, useState } from "react";
import { SyncedGameState } from "../../types";
import { pickColor } from "./utils";
import BuzzerContainer from "../common/Container";
import PlayerLobby from "./PlayerLobby";
import HostLobby from "./HostLobby";

const MAX_PLAYERS_COUNT = 5;

export type LobbySyncedState = {
  players: Player[];
};

type BaseProps = {
  gameId: string;
  socket: Socket;
  onGameStarted: (socket: Socket, host: boolean, game: SyncedGameState) => any;
};

type GuestLobbyProps = BaseProps & {
  host: false;
  initialLobby: LobbySyncedState;
};

type HostLobbyProps = BaseProps & {
  host: true;
};

type LobbyProps = GuestLobbyProps | HostLobbyProps;

export type Player = {
  id: string;
  nickname: string;
};

type State = {
  gameId: string;
  socket: Socket;
  host: boolean;
  synced: LobbySyncedState;
};

enum ActionType {
  JoinGameRequestReceived,
  LobbyDataReceived,
  LobbyDataRequest,
  NicknameUpdateRequest,
  NicknameUpdateRequestReceived,
  GameStartBroadcast,
}

type JoinGameRequestReceivedAction = {
  actionType: ActionType.JoinGameRequestReceived;
  playerId: string;
};

type LobbyDataReceivedAction = {
  actionType: ActionType.LobbyDataReceived;
  lobby: LobbySyncedState;
};

type LobbyDataRequestAction = {
  actionType: ActionType.LobbyDataRequest;
};

type NicknameUpdateRequestAction = {
  actionType: ActionType.NicknameUpdateRequest;
  nickname: string;
};

type NicknameUpdateRequestReceivedAction = {
  actionType: ActionType.NicknameUpdateRequestReceived;
  nickname: string;
  playerId: string;
};

type GameStartBroadcastAction = {
  actionType: ActionType.GameStartBroadcast;
  game: SyncedGameState;
};

type Action =
  | JoinGameRequestReceivedAction
  | LobbyDataReceivedAction
  | LobbyDataRequestAction
  | NicknameUpdateRequestAction
  | NicknameUpdateRequestReceivedAction
  | GameStartBroadcastAction;

function reducer(state: State, action: Action): State {
  const { socket } = state;

  switch (action.actionType) {
    case ActionType.JoinGameRequestReceived:
      const playerExists =
        state.synced.players.find((player) => player.id == action.playerId) !=
        undefined;

      if (!playerExists && state.synced.players.length < MAX_PLAYERS_COUNT) {
        const newPlayer: Player = { nickname: "", id: action.playerId };

        socket.emit("broadcast accept player", { playerId: action.playerId });

        const newPlayers = [...state.synced.players, newPlayer];

        return {
          ...state,
          synced: {
            ...state.synced,
            players: newPlayers,
          },
        };
      }
      return state;
    case ActionType.NicknameUpdateRequest:
      socket.emit("request nickname update", {
        playerId: state.socket.id,
        nickname: action.nickname,
      });
      return state;
    case ActionType.LobbyDataReceived:
      return { ...state, synced: action.lobby };
    case ActionType.LobbyDataRequest:
      socket.emit("broadcast lobby", state.synced);
      return state;
    case ActionType.NicknameUpdateRequestReceived:
      const newState = {
        ...state,
        synced: {
          ...state.synced,
          players: state.synced.players.map((player) => ({
            ...player,
            nickname:
              action.playerId == player.id ? action.nickname : player.nickname,
          })),
        },
      };

      socket.emit("broadcast lobby", newState.synced);
      return newState;
    case ActionType.GameStartBroadcast:
      socket.emit("broadcast game start", action.game);
      return state;
    default:
      return state;
  }
}

const updateNickname =
  (state: State, nickname: string, dispatch: React.Dispatch<Action>) => () => {
    dispatch({ actionType: ActionType.NicknameUpdateRequest, nickname });
  };

const startGame = (state: State, dispatch: React.Dispatch<Action>) => () => {
  const pickedColors: string[] = [];
  const game: SyncedGameState = {
    players: state.synced.players.map((player) => ({
      nickname: player.nickname,
      id: player.id,
      score: 0,
      color: pickColor(pickedColors),
    })),
  };

  dispatch({ actionType: ActionType.GameStartBroadcast, game });
};

export default function Lobby(props: LobbyProps) {
  const { gameId, socket, host, onGameStarted } = props;
  const playerId = socket.id != undefined ? socket.id : ""; // TODO: deal with deconnection
  const [nicknameInputValue, setNicknameInputValue] = useState("");
  const [state, dispatch] = useReducer(reducer, {
    gameId,
    socket,
    host,
    synced: props.host
      ? {
          players: [{ id: playerId, nickname: "" }],
        }
      : props.initialLobby,
  });

  useEffect(() => {
    if (host) {
      socket.on("request join game", ({ playerId }: { playerId: string }) => {
        dispatch({ actionType: ActionType.JoinGameRequestReceived, playerId });
      });

      socket.on("request lobby", () => {
        dispatch({ actionType: ActionType.LobbyDataRequest });
      });

      socket.on(
        "request nickname update",
        ({ playerId, nickname }: { playerId: string; nickname: string }) => {
          dispatch({
            actionType: ActionType.NicknameUpdateRequestReceived,
            playerId,
            nickname,
          });
        }
      );

      updateNickname(state, "host", dispatch)();
    } else {
      socket.emit("request lobby", {});
    }

    socket.on("broadcast lobby", (lobby: LobbySyncedState) => {
      dispatch({ actionType: ActionType.LobbyDataReceived, lobby });
    });

    socket.on("broadcast game start", (game: SyncedGameState) => {
      socket.off("request join game");
      socket.off("request lobby");
      socket.off("request nickname update");
      socket.off("broadcast lobby");
      socket.off("broadcast game start");

      onGameStarted(socket, host, game);
    });
  }, []);

  const player = state.synced.players.find((player) => player.id == playerId);
  const playerNickname = player ? player.nickname : "";

  const readyPlayers = state.synced.players.filter(
    (player) => player.nickname.length > 0
  );

  const isNicknameValid =
    nicknameInputValue.length >= 3 &&
    nicknameInputValue.length <= 12 &&
    nicknameInputValue != "host";

  const handleUpdateNickname = updateNickname(
    state,
    nicknameInputValue,
    dispatch
  );

  return (
    <BuzzerContainer>
      {host ? (
        <HostLobby
          readyPlayers={readyPlayers}
          startGame={startGame(state, dispatch)}
        />
      ) : (
        <PlayerLobby
          playerNickname={playerNickname}
          nicknameInputValue={nicknameInputValue}
          setNicknameInputValue={setNicknameInputValue}
          isNicknameValid={isNicknameValid}
          updateNickname={handleUpdateNickname}
        />
      )}
    </BuzzerContainer>
  );
}
