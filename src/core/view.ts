import { IEntity } from "./entity";
import { IDrawer } from "./drawer";
import { IDrawable } from "./drawable";
import { IWithParent } from "./composite";
import { ISizeData } from "core/size";

export interface IWithView {
  setView: (view: IView) => this;
}
export interface IView<T extends IEntity = IEntity>
  extends IDrawable,
    IWithParent<T> {}

export class BaseView<T extends IEntity = IEntity> implements IView<T> {
  parent: T;

  constructor(parent: T) {
    this.parent = parent;
  }

  draw(drawer: IDrawer, deltaTime: number) {
    return this;
  }
}

export class RectView<T extends IEntity = IEntity> extends BaseView<T> {
  draw(drawer: IDrawer, deltaTime: number) {
    const { x, y, w, h } = this.parent;

    drawer.fillRect(x, y, w, h);

    return this;
  }
}

export class NetView<T extends IEntity = IEntity> extends RectView<T> {
  private cellSize: ISizeData;

  constructor(parent: T, cellSize: ISizeData) {
    super(parent);

    this.cellSize = cellSize;
  }

  draw(d: IDrawer, dt: number) {
    const { x, y, w, h } = this.parent;

    d.fillRect(x, y, w, h);

    for (let j = 0; j < w; j += this.cellSize.h) {
      d.beginPath()
        .moveTo(0, j)
        .lineTo(w, j)
        .closePath()
        .stroke();

      for (let i = 0; i < w; i += this.cellSize.w) {
        d.beginPath()
          .moveTo(i, 0)
          .lineTo(i, h)
          .closePath()
          .stroke();
      }
    }

    return this;
  }
}
