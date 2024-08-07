import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Player } from "../../../types";

export default ({ players, addScore }: IProps) => {
  const getRow = (player: Player) =>
    player.nickname != "host" && (
      <TableRow key={player.id}>
        <TableCell align="right">
          <Typography variant="h5">{player.nickname}</Typography>
        </TableCell>
        <TableCell>
          <Stack justifyContent="flex-end" direction="row" spacing={2}>
            {addScore && (
              <Button
                onClick={() => addScore({ playerId: player.id, scoreDiff: -1 })}
                color="error"
                variant="contained"
                size="small"
              >
                -
              </Button>
            )}
            <Typography align="center" variant="h5">
              {player.score}
            </Typography>
            {addScore && (
              <Button
                onClick={() => addScore({ playerId: player.id, scoreDiff: 1 })}
                color="success"
                variant="contained"
                size="small"
              >
                +
              </Button>
            )}
          </Stack>
        </TableCell>
      </TableRow>
    );

  return (
    <Table>
      <TableBody>{players.map(getRow)}</TableBody>
    </Table>
  );
};

type IProps = {
  players: Player[];
  addScore?: ({
    playerId,
    scoreDiff,
  }: {
    playerId: string;
    scoreDiff: number;
  }) => void;
};
