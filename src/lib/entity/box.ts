import {
  Color,
  Entity,
  IBrush,
  BaseView,
  IBoundsData,
  BaseBehavior
} from "core";

class View extends BaseView<Box> {
  draw = (b: IBrush, dt: number) => {
    const { x, y, w, h } = this.parent;

    b.setStyle({
      fillStyle: Color.random(),
      strokeStyle: Color.random()
    })
      .fillRect(x, y, w, h)
      .strokeRect(x, y, w, h);

    return this;
  };
}

export class Box extends Entity {
  constructor(bounds?: IBoundsData) {
    super(bounds);

    this.setBehavior(new BaseBehavior(this)).setView(new View(this));
  }
}
