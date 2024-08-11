import { Button, Typography } from "@mui/material";

import { Player } from "../../../types";
import PlayerList from "./PlayerList";
import PlayerWhoBuzzed from "./PlayerWhoBuzzed";

export default ({
  players,
  playerWhoBuzzed,
  resetBuzzers,
  addScore,
}: IProps) => (
  <>
    <PlayerWhoBuzzed playerWhoBuzzed={playerWhoBuzzed} />

    <Button
      onClick={resetBuzzers}
      variant="contained"
      size="large"
      disabled={!playerWhoBuzzed}
    >
      Reset buzzers
    </Button>

    <PlayerList
      players={players}
      playerWhoBuzzed={playerWhoBuzzed}
      addScore={addScore}
    />
  </>
);

type IProps = {
  players: Player[];
  playerWhoBuzzed?: Player;
  resetBuzzers: () => void;
  addScore: ({
    playerId,
    scoreDiff,
  }: {
    playerId: string;
    scoreDiff: number;
  }) => void;
};
