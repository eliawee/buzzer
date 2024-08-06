import { range } from "lodash";

export function addCircular(a: number, b: number, max: number) {
  return a + b > max ? a + b - max - 1 : a + b;
}

export function getPlayersOrder(
  playersCount: number,
  playerTurn: number
): number[] {
  return range(playersCount).map((index) =>
    index < playersCount - 1
      ? addCircular(playerTurn, index + 1, playersCount - 1)
      : playerTurn
  );
}
