import { Button, Typography } from "@mui/material";
import { Player } from "../../../types";

export default ({ onBuzz, player, playerWhoBuzzed }: IProps) => {
  return (
    <>
      <Typography align="center" variant="h4">
        {player.nickname}
      </Typography>
      <Button
        onClick={onBuzz}
        variant="contained"
        size="large"
        disabled={playerWhoBuzzed !== undefined}
      >
        BUZZ
      </Button>
    </>
  );
};

type IProps = {
  onBuzz: () => void;
  player: Player;
  playerWhoBuzzed?: Player;
};
