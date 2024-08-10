import { Button, Stack, TextField } from "@mui/material";

export default ({
  nicknameInputValue,
  setNicknameInputValue,
  isNicknameValid,
  updateNickname,
}: IProps) => (
  <Stack spacing={2}>
    <TextField
      id="filled-basic"
      label="Nom"
      variant="filled"
      value={nicknameInputValue}
      onChange={(evt) => setNicknameInputValue(evt.target.value)}
      onKeyDown={(evt) => {
        if (evt.key == "Enter" && isNicknameValid) {
          updateNickname();
        }
      }}
    />
    <Button
      variant="contained"
      disabled={!isNicknameValid}
      onClick={updateNickname}
    >
      Valider
    </Button>
  </Stack>
);

type IProps = {
  nicknameInputValue: string;
  setNicknameInputValue: (value: string) => void;
  isNicknameValid: boolean;
  updateNickname: () => void;
};
