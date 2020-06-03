import { IEntity } from "./entity";
import { ISizeData } from "./size";
import { IDrawable } from "./drawable";
import { IWithParent } from "./composite";
import { IBrush, IBrushStyle } from "./brush";

export interface IWithView {
  setView: (view: IView) => this;
}

export interface IStylable {
  style: IBrushStyle;

  setStyle: (style: IBrushStyle) => this;
}

export interface IView<T extends IEntity = IEntity>
  extends IDrawable,
    IStylable,
    IWithParent<T> {}

export class BaseView<T extends IEntity = IEntity> implements IView<T> {
  parent: T;

  style: IBrushStyle = {};

  constructor(parent: T) {
    this.parent = parent;
  }

  draw(brush: IBrush, deltaTime: number) {
    const { parent: e, style } = this;

    Object.assign(brush, style);

    if (!style.noTranslate && e.length && e.x + e.y > 0) {
      brush.translate(e.x, e.y);
    }

    this.parent.forEach(children => children.draw(brush, deltaTime));

    return this;
  }

  setStyle = (style: IBrushStyle) => {
    this.style = { ...this.style, ...style };

    return this;
  };
}

export class RectView<T extends IEntity = IEntity> extends BaseView<T> {
  draw(brush: IBrush, deltaTime: number) {
    const { x, y, w, h } = this.parent;

    brush.fillRect(x, y, w, h);

    return super.draw(brush, deltaTime);
  }
}

export class NetView<T extends IEntity = IEntity> extends RectView<T> {
  private cellSize: ISizeData;

  constructor(parent: T, cellSize: ISizeData) {
    super(parent);

    this.cellSize = cellSize;
  }

  draw(b: IBrush, dt: number) {
    const { x, y, w, h } = this.parent;

    b.fillRect(x, y, w, h);

    for (let j = 0; j < w; j += this.cellSize.h) {
      b.beginPath()
        .moveTo(0, j)
        .lineTo(w, j)
        .closePath()
        .stroke();

      for (let i = 0; i < w; i += this.cellSize.w) {
        b.beginPath()
          .moveTo(i, 0)
          .lineTo(i, h)
          .closePath()
          .stroke();
      }
    }

    return this;
  }
}
