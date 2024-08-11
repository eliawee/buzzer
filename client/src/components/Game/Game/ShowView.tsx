import { Typography } from "@mui/material";
import PlayerList from "./PlayerList";
import { Player } from "../../../types";
import PlayerWhoBuzzed from "./PlayerWhoBuzzed";

export default ({ players, playerWhoBuzzed }: IProps) => (
  <>
    <PlayerWhoBuzzed playerWhoBuzzed={playerWhoBuzzed} playSounds />
    <PlayerList players={players} playerWhoBuzzed={playerWhoBuzzed} />
  </>
);

type IProps = {
  players: Player[];
  playerWhoBuzzed?: Player;
};
