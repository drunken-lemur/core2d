import { IBounds } from "./bounds";
import { Point } from "core/point";

export enum Unit {
  rad,
  deg
}

export const { PI, sin, cos } = Math;
export const PI2 = PI * 2;

export const Deg = PI / 180;
export const Deg180 = PI;
export const Deg360 = PI2;

export interface IRotatable extends IBounds {
  rotation: number;
  moveByRotation: (length: number) => this;
  rotate: (angle: number, unit?: Unit) => this;
  moveToAngle: (angle: number, length: number, unit?: Unit) => this;
}

export const pointByAngle = (angle: number, length: number = 1) => {
  const x = length * sin(angle * -Deg);
  const y = length * cos(angle * -Deg);

  return Point.valueOf(x, y);
};
