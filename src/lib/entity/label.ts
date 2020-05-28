import {
  BaseBehavior,
  BaseView,
  Entity,
  IBoundsData,
  IDrawer,
  Delay,
  IDelay
} from "core";

export class TypingLabelBehavior extends BaseBehavior<Label> {
  private delay: IDelay;
  private originalText: string;

  constructor(
    label: Label,
    typingSec: number,
    delaySec = 0,
    onDone?: () => void
  ) {
    super(label);

    this.delay = new Delay(typingSec, onDone, delaySec);
    this.originalText = label.text;
  }

  update(dt: number) {
    const { delay, originalText, parent } = this;

    delay.update(dt);

    if (delay.isStart) {
      parent.show().text = originalText.substr(
        0,
        Math.floor(originalText.length * delay.factor)
      );
    } else {
      parent.hide();
    }

    if (delay.isDone) {
    }

    return super.update(dt);
  }
}

export class Label extends Entity {
  private static View = class extends BaseView<Label> {
    draw(d: IDrawer, dt: number) {
      const { x, y } = this.parent;

      const width = d.measureText(this.parent.text).width;
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

      d.fillText(this.parent.text, x, y + height);

      return super.draw(d, dt);
    }
  };

  text: string;

  constructor(text: string = "", bounds?: IBoundsData) {
    super(bounds);

    this.text = text;

    this.setView(new Label.View(this));
  }
}
