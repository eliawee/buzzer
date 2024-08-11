import { Typography, styled } from "@mui/material";
import { Player } from "../../../types";

export default ({ playerWhoBuzzed }: IProps) => (
  <PlayerName align="center" variant="h4" playerWhoBuzzed={playerWhoBuzzed}>
    {playerWhoBuzzed == undefined ? "Waiting for a player to buzz" : null}
    {playerWhoBuzzed != undefined ? `${playerWhoBuzzed.nickname} buzzed` : null}
  </PlayerName>
);

type IProps = {
  playerWhoBuzzed?: Player;
};

const PlayerName = styled(Typography)(({ playerWhoBuzzed }: IProps) => ({
  borderColor: playerWhoBuzzed?.color ?? "#fff",
  borderStyle: "solid",
  borderWidth: 15,
}));
