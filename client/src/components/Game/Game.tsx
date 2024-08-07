import { useEffect, useReducer } from "react";
import { Player, SyncedGameState } from "../../types";
import Transmitter from "../../Transmitter";
import reducer from "./reducer";
import {
  broadcastGameState,
  requestBuzz,
  requestBuzzReceived,
  requestResetBuzzers,
} from "./actions";
import HostView from "./Game/HostView";
import PlayerView from "./Game/PlayerView";

type GameProps = {
  playerId: string;
  transmitter: Transmitter;
  host: boolean;
  initialSyncedState: SyncedGameState;
};

export default function Game(props: GameProps) {
  let [state, dispatch] = useReducer(reducer, {
    playerId: props.playerId,
    transmitter: props.transmitter,
    host: props.host,
    synced: props.initialSyncedState,
  });

  let { host, transmitter, playerId } = state;
  let maybeLocalPlayer = state.synced.players.find((p) => p.id == playerId);

  if (maybeLocalPlayer == undefined) {
    throw new Error("Failed to find local player");
  }

  let localPlayer: Player = maybeLocalPlayer;

  let playerWhoBuzzed =
    state.synced.buzzPlayerId != undefined
      ? state.synced.players.find(
          (player) => player.id == state.synced.buzzPlayerId
        )
      : undefined;

  useEffect(() => {
    transmitter.reset();

    if (host) {
      transmitter.requestBuzz.on(requestBuzzReceived(state, dispatch));
    }

    transmitter.broadcastGameState.on(broadcastGameState(state, dispatch));
  }, []);

  return (
    <>
      {host && (
        <HostView
          playerWhoBuzzed={playerWhoBuzzed}
          resetBuzzers={requestResetBuzzers(state, dispatch)}
        />
      )}

      {!host && <PlayerView onBuzz={requestBuzz(state, dispatch)} />}
    </>
  );
}
