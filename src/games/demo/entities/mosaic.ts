import { Entity, ISizeData, Size, Point } from "../../../core";

import { Square } from "./square";

export class Mosaic extends Entity {
  constructor(size: ISizeData, cells: ISizeData) {
    super();

    this.setSize(size);

    const cellSize = Size.objectOf(size).divide(cells);
    const { w, h } = cellSize;

    for (let y = 0; y < cells.h; y++) {
      for (let x = 0; x < cells.w; x++) {
        this.add(new Square(cellSize).setPosition(Point.valueOf(x * w, y * h)));
      }
    }
  }
}
