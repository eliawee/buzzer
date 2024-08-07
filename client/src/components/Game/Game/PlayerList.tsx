import {
  Button,
  Stack,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Player } from "../../../types";

export default ({ players }: IProps) => {
  const getRow = (player: Player) =>
    player.nickname != "host" && (
      <TableRow>
        <TableCell align="right">{player.nickname}</TableCell>
        <TableCell>
          <Stack justifyContent="flex-end" direction="row" spacing={2}>
            <Button color="error" variant="contained" size="small">
              -
            </Button>
            <Typography align="center">0</Typography>
            <Button color="success" variant="contained" size="small">
              +
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );

  return <Table>{players.map(getRow)}</Table>;
};

type IProps = {
  players: Player[];
};
