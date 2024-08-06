import { first, get, last, range, shuffle, sum } from "lodash";
import { Player, SyncedGameState } from "../../types";
import { Action, ActionType, State } from "./types";

declare global {
  interface Window {
    rolls?: number[];
    initialCoins?: number;
  }
}

export default function reducer(state: State, action: Action): State {
  let { transmitter, playerId } = state;
  let maybeLocalPlayer = state.synced.players.find((p) => p.id == playerId);

  let syncedState: SyncedGameState = state.synced;

  if (!maybeLocalPlayer) {
    console.error("Cannot find player in synced game list");
    return state;
  }

  let localPlayer = maybeLocalPlayer;

  switch (action.actionType) {
    case ActionType.SyncedGameStateReceived:
      return { ...state, synced: action.syncedState };
    case ActionType.RequestBuzz:
      transmitter.requestBuzz.emit({ playerId: localPlayer.id });
      return state;
    case ActionType.RequestBuzzReceived:
      syncedState =
        state.synced.buzzPlayerId == undefined
          ? { ...syncedState, buzzPlayerId: action.playerId }
          : syncedState;
      transmitter.broadcastGameState.emit(syncedState);
      return state;
  }
}