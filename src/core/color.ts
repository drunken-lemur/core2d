export enum Color {
  Black = "black",
  White = "white"
}

export const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);
