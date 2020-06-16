export enum Unit {
  rad,
  deg
}

export const { PI } = Math;
export const PI2 = PI * 2;

export const Deg = PI / 180;
export const Deg180 = PI;
export const Deg360 = PI2;

export interface IRotatable {
  r?: number;
  moveByRotation: (length: number) => this;
  rotate: (angle: number, unit?: Unit) => this;
  moveToAngle: (angle: number, length: number, unit?: Unit) => this;
}
