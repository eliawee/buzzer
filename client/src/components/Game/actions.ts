import { MouseEventHandler } from "react";
import { SyncedGameState } from "../../types";
import { Action, ActionType, State } from "./types";

export let broadcastGameState =
  (state: State, dispatch: React.Dispatch<Action>) =>
  (syncedState: SyncedGameState) =>
    dispatch({
      actionType: ActionType.SyncedGameStateReceived,
      syncedState,
    });

export let requestBuzz =
  (state: State, dispatch: React.Dispatch<Action>) => () =>
    dispatch({
      actionType: ActionType.RequestBuzz,
    });

export let requestBuzzReceived =
  (state: State, dispatch: React.Dispatch<Action>) =>
  ({ playerId }: { playerId: string }) =>
    dispatch({
      actionType: ActionType.RequestBuzzReceived,
      playerId,
    });

export let requestResetBuzzers =
  (state: State, dispatch: React.Dispatch<Action>) => () =>
    dispatch({
      actionType: ActionType.RequestResetBuzzers,
    });

export let requestAddScore =
  (state: State, dispatch: React.Dispatch<Action>) =>
  ({ playerId, scoreDiff }: { playerId: string; scoreDiff: number }) =>
    dispatch({
      actionType: ActionType.RequestAddScore,
      playerId,
      scoreDiff,
    });
