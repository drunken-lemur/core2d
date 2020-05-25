import {
  Color,
  Entity,
  IDrawer,
  BaseView,
  IBoundsData,
  BaseBehavior
} from "core";

class View extends BaseView<Box> {
  draw = (d: IDrawer, dt: number) => {
    const { x, y, w, h } = this.parent;

    d.setStyle({
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
