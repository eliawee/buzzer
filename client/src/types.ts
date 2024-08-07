export type Player = {
  nickname: string;
  id: string;
  score: number;
};

export type SyncedGameState = {
  buzzPlayerId?: string;
  players: Player[];
};
