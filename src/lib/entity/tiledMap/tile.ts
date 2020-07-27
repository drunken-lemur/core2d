import { IPointData } from "core";

export interface ITile extends IPointData {
  id: number;
}

export class Tile implements ITile {
  x: number;
  y: number;
  id: number;

  constructor(x: number, y: number, id: number) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}
