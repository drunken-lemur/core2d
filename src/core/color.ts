enum ColorSet {
  Transparent = "#000000",
  None = Transparent,
  Black = "#000",
  White = "#fff",
  Gray = "#ccc",
  Red = "#f00",
  Green = "#0f0",
  Blue = "#00f"
}

export type Color = ColorSet;

export namespace Color {
  export const Transparent = ColorSet.Transparent;
  export const None = ColorSet.None;
  export const Black = ColorSet.Black;
  export const White = ColorSet.White;
  export const Gray = ColorSet.Gray;
  export const Red = ColorSet.Red;
  export const Green = ColorSet.Green;
  export const Blue = ColorSet.Blue;

  export const random = (): Color => {
    return ("#" + Math.floor(Math.random() * 16777215).toString(16)) as Color;
  };
}
