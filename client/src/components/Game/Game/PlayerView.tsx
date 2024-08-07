import { Button, Typography, styled } from "@mui/material";
import { Player } from "../../../types";

export default ({ onBuzz, player, playerWhoBuzzed }: IProps) => {
  return (
    <>
      <Typography align="center" variant="h4">
        {player.nickname}
      </Typography>
      <BuzzerButton
        onClick={onBuzz}
        variant="contained"
        size="large"
        disabled={playerWhoBuzzed !== undefined}
        overrideColor={player.color}
      >
        BUZZ
      </BuzzerButton>
    </>
  );
};

const BuzzerButton = styled(Button)(
  ({ overrideColor }: { overrideColor: string }) => ({
    backgroundColor: overrideColor,
  })
);

type IProps = {
  onBuzz: () => void;
  player: Player;
  playerWhoBuzzed?: Player;
};
