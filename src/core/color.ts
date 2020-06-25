enum ColorSet {
  Transparent = "rgba(0, 0, 0, 0)",
  None = Transparent,
  Black = "#000",
  White = "#fff",
  Gray = "#ccc",
  Red = "#f00",
  Green = "#0f0",
  Blue = "#00f",
  MarioSky = "#6b8cff"
}

export type Color = ColorSet;

export interface IRgbaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export namespace Color {
  export const Transparent = ColorSet.Transparent;
  export const None = ColorSet.None;
  export const Black = ColorSet.Black;
  export const White = ColorSet.White;
  export const Gray = ColorSet.Gray;
  export const Red = ColorSet.Red;
  export const Green = ColorSet.Green;
  export const Blue = ColorSet.Blue;
  export const MarioSky = ColorSet.MarioSky;

  export const random = (): Color => {
    return ("#" + Math.floor(Math.random() * 16777215).toString(16)) as Color;
  };

  export const hexToRgb = (hex: string): IRgbaColor | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{0,2})$/i.exec(hex);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: parseInt(result[4], 16) || 255
        }
      : null;
  };
}
