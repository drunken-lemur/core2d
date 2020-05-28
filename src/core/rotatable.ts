import { IBounds } from "./bounds";

export enum Unit {
  rad,
  deg
}

export const Deg = Math.PI / 180;

export interface IRotatable extends IBounds {
  rotation: number;
  moveByRotation: (length: number) => this;
  rotate: (angle: number, unit?: Unit) => this;
  moveToAngle: (angle: number, length: number, unit?: Unit) => this;
}
