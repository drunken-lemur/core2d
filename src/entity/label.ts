import { BaseView, Entity, IBoundsData, IDrawer, IDrawerStyle } from "core";

class View extends BaseView<Label> {
  draw = (drawer: IDrawer, deltaTime: number) => {
    const { x, y } = this.parent;

    const height = 0;
    // Number(`${this.parent.style.font}`.replace(/[^0-9]/g, "")) || this.parent.h;

    drawer.fillText(this.parent.text, x, y + height);

    return super.draw(drawer, deltaTime);
  };
}

export class Label extends Entity {
  text: string;
  style: IDrawerStyle = {};

  constructor(value?: string, bounds?: IBoundsData) {
    super(bounds);

    this.text = value || "";

    this.setView(new View(this));
  }
}
