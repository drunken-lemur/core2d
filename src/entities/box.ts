import {
  Entity,
  IDrawer,
  BaseView,
  IBoundsData,
  BaseBehavior,
  Color
} from "../core";

class View extends BaseView<Box> {
  constructor(box: Box) {
    super(box);

    this.styles.strokeStyle = Color.Black;
  }

  draw = (drawer: IDrawer, deltaTime: number) => {
    super.draw(drawer, deltaTime);

    return this;
  };
}

export class Box extends Entity {
  constructor(bounds: IBoundsData) {
    super(bounds);

    this.setBehavior(new BaseBehavior(this)).setView(new View(this));
  }
}
