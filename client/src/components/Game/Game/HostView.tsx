import { Button, Typography } from "@mui/material";

import { Player } from "../../../types";
import PlayerList from "./PlayerList";

export default ({
  players,
  playerWhoBuzzed,
  resetBuzzers,
  addScore,
}: IProps) => (
  <>
    <Typography align="center" variant="h4">
      {playerWhoBuzzed == undefined ? "Waiting for a player to buzz" : null}
      {playerWhoBuzzed != undefined
        ? `${playerWhoBuzzed.nickname} buzzed`
        : null}
    </Typography>
    <Button
      onClick={resetBuzzers}
      variant="contained"
      size="large"
      disabled={!playerWhoBuzzed}
    >
      Reset buzzers
    </Button>

    <PlayerList players={players} addScore={addScore} />
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
