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
  SyncedGameStateReceived,
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

export type Action =
  | SyncedGameStateReceivedAction
  | RequestBuzzAction
  | RequestBuzzReceivedAction;
