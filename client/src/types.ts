export type Player = {
  nickname: string;
  id: string;
};

export type SyncedGameState = {
  buzzPlayerId?: string;
  players: Player[];
};
