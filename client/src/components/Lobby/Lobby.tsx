import { Socket } from "socket.io-client";
import "./Lobby.css";
import { useEffect, useReducer, useState } from "react";
import { SyncedGameState } from "../../types";

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

type Player = {
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
  let { socket } = state;

  switch (action.actionType) {
    case ActionType.JoinGameRequestReceived:
      let playerExists =
        state.synced.players.find((player) => player.id == action.playerId) !=
        undefined;

      if (!playerExists && state.synced.players.length < MAX_PLAYERS_COUNT) {
        let newPlayer: Player = { nickname: "", id: action.playerId };

        socket.emit("broadcast accept player", { playerId: action.playerId });

        let newPlayers = [...state.synced.players, newPlayer];

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
      let newState = {
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

let updateNickname =
  (state: State, nickname: string, dispatch: React.Dispatch<Action>) => () => {
    console.log("updateNickname");
    dispatch({ actionType: ActionType.NicknameUpdateRequest, nickname });
  };

let startGame = (state: State, dispatch: React.Dispatch<Action>) => () => {
  let game: SyncedGameState = {
    players: state.synced.players.map((player) => ({
      nickname: player.nickname,
      id: player.id,
    })),
  };

  dispatch({ actionType: ActionType.GameStartBroadcast, game });
};

export default function Lobby(props: LobbyProps) {
  let { gameId, socket, host, onGameStarted } = props;
  let playerId = socket.id != undefined ? socket.id : ""; // TODO: deal with deconnection
  let [nicknameInputValue, setNicknameInputValue] = useState("");
  let [state, dispatch] = useReducer(reducer, {
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

  let player = state.synced.players.find((player) => player.id == playerId);
  let playerNickname = player ? player.nickname : "";

  let readyPlayers = state.synced.players.filter(
    (player) => player.nickname.length > 0
  );

  let isNicknameValid =
    nicknameInputValue.length >= 3 && nicknameInputValue.length <= 12;

  return (
    <div className="lobby">
      <div className="header">
        <a href="/">
          <h1>Buzzer</h1>
        </a>
      </div>
      <div className="content">
        {playerNickname.length == 0 ? (
          <div className="nickname-edit">
            <div className="group">
              <input
                type="text"
                placeholder="Nom"
                value={nicknameInputValue}
                onChange={(evt) => setNicknameInputValue(evt.target.value)}
                onKeyDown={(evt) => {
                  if (evt.key == "Enter" && isNicknameValid) {
                    updateNickname(state, nicknameInputValue, dispatch)();
                  }
                }}
              />
            </div>
            <button
              disabled={!isNicknameValid}
              onClick={updateNickname(state, nicknameInputValue, dispatch)}
            >
              Valider
            </button>
          </div>
        ) : (
          <div className="players-list">
            {readyPlayers.map((player) => (
              <div className="player-nickname">{player.nickname}</div>
            ))}
            {host ? (
              <button
                disabled={readyPlayers.length < 2}
                onClick={startGame(state, dispatch)}
              >
                Commencer
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
