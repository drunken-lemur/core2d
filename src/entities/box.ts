import {
  Entity,
  IDrawer,
  BaseView,
  IBoundsData,
  randomColor,
  BaseBehavior,
} from "core";

class View extends BaseView<Box> {
  draw = (drawer: IDrawer, deltaTime: number) => {
    const { x, y, w, h } = this.parent;
    drawer.strokeStyle = randomColor();
    drawer.strokeRect(x, y, w, h);

    return this;
  };
}

export class Box extends Entity {
  constructor(bounds?: IBoundsData) {
    super(bounds);

    this.setBehavior(new BaseBehavior(this)).setView(new View(this));
  }
}
