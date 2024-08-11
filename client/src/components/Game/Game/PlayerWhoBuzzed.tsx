import { Typography, styled } from "@mui/material";
import { Player } from "../../../types";
import { useEffect, useState } from "react";

export default ({ playerWhoBuzzed, playSounds }: IProps) => {
  const [playerName, setPlayerName] = useState<string | undefined>();
  const buzzSfx = playSounds && new Audio("/sfx/buzz.wav");

  useEffect(() => {
    if (playerWhoBuzzed?.nickname != playerName) {
      setPlayerName(playerWhoBuzzed?.nickname);
      if (buzzSfx && playerWhoBuzzed?.nickname) buzzSfx.play();
    }
  }, [playerWhoBuzzed, playerName, setPlayerName]);

  return (
    <PlayerName align="center" variant="h4" playerWhoBuzzed={playerWhoBuzzed}>
      {playerWhoBuzzed == undefined ? "Waiting for a player to buzz" : null}
      {playerWhoBuzzed != undefined
        ? `${playerWhoBuzzed.nickname} buzzed`
        : null}
    </PlayerName>
  );
};

type IProps = {
  playerWhoBuzzed?: Player;
  playSounds?: boolean;
};

const PlayerName = styled(Typography)(
  ({ playerWhoBuzzed }: { playerWhoBuzzed?: Player }) => ({
    borderColor: playerWhoBuzzed?.color ?? "#fff",
    borderStyle: "solid",
    borderWidth: 15,
  })
);
