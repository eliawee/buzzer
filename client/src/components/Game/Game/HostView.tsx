import { Button, Stack, Typography, styled } from "@mui/material";
import Paper from "@mui/material/Paper";

import { Player } from "../../../types";

export default ({ playerWhoBuzzed, resetBuzzers }: IProps) => (
  <Container elevation={3}>
    <Stack spacing={1}>
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
    </Stack>
  </Container>
);

const Container = styled(Paper)({
  width: "80vw",
  padding: 20,
  margin: 20,
});

type IProps = {
  playerWhoBuzzed?: Player;
  resetBuzzers: () => void;
};
