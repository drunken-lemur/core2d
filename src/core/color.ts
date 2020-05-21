export enum Color {
  Black = "#000",
  White = "#fff",
  Gray = "#ccc",
  Red = "#f00",
  Green = "#0f0",
  Blue = "#00f",
}

export const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);
