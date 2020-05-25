import { Entity, ISizeData, Size, Point, BaseView, Color, IDrawer } from "core";

import { Square } from "entity";

export class Mosaic extends Entity {
  private static View = class extends BaseView<Mosaic> {
    draw(d: IDrawer, dt: number) {
      const { x, y, w, h } = this.parent;

      d.setStyle({ fillStyle: Color.Blue }).fillRect(x, y, w, h);

      return super.draw(d, dt);
    }
  };

  constructor(size: ISizeData, cells: ISizeData) {
    super();

    this.setSize(size).setView(new Mosaic.View(this));

    const cellSize = new Size(size).divide(cells);
    const { w, h } = cellSize;

    for (let y = 0; y < cells.h; y++) {
      for (let x = 0; x < cells.w; x++) {
        this.add(new Square(cellSize).setPosition(Point.valueOf(x * w, y * h)));
      }
    }
  }
}
