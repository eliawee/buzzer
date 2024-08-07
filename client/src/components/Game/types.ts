import Transmitter from "../../Transmitter";
import { SyncedGameState } from "../../types";

export enum Environment {
  Development,
  Production,
}

export type State = {
  playerId: string;
  transmitter: Transmitter;
  host: boolean;
  synced: SyncedGameState;
};

export enum ActionType {
  RequestBuzz,
  RequestBuzzReceived,
  RequestResetBuzzers,
  SyncedGameStateReceived,
  RequestAddScore,
}

export type SyncedGameStateReceivedAction = {
  actionType: ActionType.SyncedGameStateReceived;
  syncedState: SyncedGameState;
};

export type RequestBuzzAction = {
  actionType: ActionType.RequestBuzz;
};

export type RequestBuzzReceivedAction = {
  actionType: ActionType.RequestBuzzReceived;
  playerId: string;
};

export type RequestResetBuzzersAction = {
  actionType: ActionType.RequestResetBuzzers;
};

export type RequestAddScoreAction = {
  actionType: ActionType.RequestAddScore;
  playerId: string;
  scoreDiff: number;
};

export type Action =
  | SyncedGameStateReceivedAction
  | RequestBuzzAction
  | RequestBuzzReceivedAction
  | RequestResetBuzzersAction
  | RequestAddScoreAction;
