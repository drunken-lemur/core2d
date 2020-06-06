import {
  BaseBehavior,
  BaseView,
  Entity,
  IBoundsData,
  IBrush,
  Delay,
  IDelay
} from "core";

export class Label extends Entity {
  private static View = class extends BaseView<Label> {
    draw(b: IBrush, dt: number) {
      const { x, y } = this.parent;

      const width = b.measureText(this.parent.text).width;
      const height =
        Number(`${this.parent.style.font}`.replace(/[^0-9]/g, "")) ||
        this.parent.h ||
        10;

      if (this.parent.w !== width) {
        this.parent.w = width;
      }
      if (this.parent.h !== height) {
        this.parent.h = height;
      }

      b.fillText(this.parent.text, x, y + height);

      return super.draw(b, dt);
    }
  };

  text: string;

  constructor(text: string = "", bounds?: IBoundsData) {
    super(bounds);

    this.text = text;

    this.addViews(new Label.View(this));
  }
}
