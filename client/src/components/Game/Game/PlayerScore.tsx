import { Typography } from "@mui/material";
import { Player } from "../../../types";
import { useEffect, useState } from "react";

export default ({ player, playSounds }: IProps) => {
  const [playerScore, setPlayerScore] = useState(0);
  const pointSfx = playSounds && new Audio("/sfx/point.wav");

  useEffect(() => {
    if (player.score != playerScore) {
      setPlayerScore(player.score);
      if (pointSfx && player.score > playerScore) {
        pointSfx.play();
      }
    }
  }, [player, playerScore, setPlayerScore]);

  return (
    <Typography align="center" variant="h5">
      {player.score}
    </Typography>
  );
};

type IProps = {
  player: Player;
  playSounds: boolean;
};
