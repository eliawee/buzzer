import { difference, sample } from "lodash";

const colors = [
  "#9e0142",
  "#d53e4f",
  "#f46d43",
  "#fdae61",
  "#fee08b",
  "#e6f598",
  "#abdda4",
  "#66c2a5",
  "#3288bd",
  "#5e4fa2",
];

const defaultColor = "#000";

export const pickColor = (pickedColors: string[]): string => {
  const remainingColors = difference(colors, pickedColors);
  const color = sample(remainingColors) || defaultColor;
  pickedColors = [...pickedColors, color];
  return color;
};
