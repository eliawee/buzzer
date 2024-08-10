import { Button, Stack, Typography } from "@mui/material";
import { map } from "lodash";
import { Player } from "./Lobby";

export default ({ readyPlayers, startGame }: IProps) => (
  <Stack spacing={2}>
    {map(readyPlayers, (player) => (
      <Typography variant="h4" key={player.id}>
        {player.nickname}
      </Typography>
    ))}

    <Button
      variant="contained"
      size="large"
      disabled={readyPlayers.length < 2}
      onClick={startGame}
    >
      Commencer
    </Button>
  </Stack>
);

type IProps = {
  readyPlayers: Player[];
  startGame: () => void;
};
