export enum Color {
  Black = "#000",
  White = "#fff",
  Gray = "#ccc"
}

export const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);
