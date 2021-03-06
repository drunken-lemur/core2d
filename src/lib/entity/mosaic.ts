import { Color, Entity, ISizeData, Point, sceneView, Size } from "core";

import { Square } from "lib/entity";

export class Mosaic extends Entity {
  style = { fillStyle: Color.Blue };

  views = [sceneView];

  constructor(size: ISizeData, cells: ISizeData) {
    super(size);

    const cellSize = new Size(size).divide(cells);
    const { w, h } = cellSize;

    for (let y = 0; y < cells.h; y++) {
      for (let x = 0; x < cells.w; x++) {
        this.add(new Square(cellSize).setPosition(Point.valueOf(x * w, y * h)));
      }
    }
  }
}
