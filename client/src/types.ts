export type Player = {
  nickname: string;
  id: string;
  score: number;
  color: string;
};

export type SyncedGameState = {
  buzzPlayerId?: string;
  players: Player[];
};
