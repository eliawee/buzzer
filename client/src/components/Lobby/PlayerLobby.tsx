import { Typography } from "@mui/material";
import NicknameEdit from "./NicknameEdit";

export default ({
  playerNickname,
  nicknameInputValue,
  setNicknameInputValue,
  isNicknameValid,
  updateNickname,
}: IProps) =>
  playerNickname ? (
    <Typography>Waiting for game to start</Typography>
  ) : (
    <NicknameEdit
      nicknameInputValue={nicknameInputValue}
      setNicknameInputValue={setNicknameInputValue}
      isNicknameValid={isNicknameValid}
      updateNickname={updateNickname}
    />
  );

type IProps = {
  playerNickname: string;
  nicknameInputValue: string;
  setNicknameInputValue: (value: string) => void;
  isNicknameValid: boolean;
  updateNickname: () => void;
};
