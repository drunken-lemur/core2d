import { Color } from "./color";
import { IEntity } from "./entity";
import { ISizeData } from "./size";
import { IDrawable } from "./drawable";
import { IWithParent } from "./composite";
import { IBrush, IBrushStyle } from "./brush";

export interface IWithView {
  addViews: (...views: IView[]) => this;
  setViews: (...views: IView[]) => this;
  removeViews: (...views: IView[]) => this;
  clearViews: () => this;
}

export interface IStylable {
  style: IBrushStyle;

  setStyle: (style: IBrushStyle) => this;
  // removeStyle: (...rules: (keyof IBrushStyle)[]) => this; // todo: fix it
}

export interface IViewClass<T extends IEntity = IEntity>
  extends IDrawable,
    IStylable,
    IWithParent<T> {}

export type IViewFunction<T extends IEntity = IEntity> = (
  entity: T,
  brush: IBrush,
  deltaTime: number
) => void;

export type IView<T extends IEntity = IEntity> =
  | IViewClass<T>
  | IViewFunction<T>;

export class BaseView<T extends IEntity = IEntity> implements IViewClass<T> {
  parent: T;

  constructor(parent: T) {
    this.parent = parent;
  }

  private _style: IBrushStyle = {};

  get style() {
    return this._style;
  }

  set style(style: IBrushStyle) {
    this._style = { ...this._style, ...style };
  }

  draw(brush: IBrush, deltaTime: number) {
    const { parent: e, style } = this;

    Object.assign(brush, style);

    if (!style.noTranslate && e.length && e.x + e.y > 0) {
      brush.translate(e.x, e.y);
    }

    this.parent.forEach(children => children.draw(brush, deltaTime));
  }

  setStyle = (style: IBrushStyle) => {
    this._style = { ...this._style, ...style };

    return this;
  };
}

export class RectView<T extends IEntity = IEntity> extends BaseView<T> {
  draw(brush: IBrush, deltaTime: number) {
    const { x, y, w, h } = this.parent;

    if (brush.fillStyle !== Color.None) {
      brush.fillRect(x, y, w, h);
    }

    if (brush.strokeStyle !== Color.None) {
      brush.strokeRect(x, y, w, h);
    }
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
  }
}

export const childrenView: IViewFunction = (entity, brush, deltaTime) => {
  entity.forEach(children => {
    brush.save();
    children.draw(brush, deltaTime);
    brush.restore();
  });
};

export const saveBrushView: IViewFunction = (entity, brush, deltaTime) => {
  brush.save();
};

export const restoreBrushView: IViewFunction = (entity, brush, deltaTime) => {
  brush.restore();
};

export const reverseView: IViewFunction = (entity, brush, deltaTime) => {
  entity.values.reverse().forEach(children => {
    brush.save();
    children.draw(brush, deltaTime);
    brush.restore();
  });
};

export const styledView: IViewFunction = (entity, brush, deltaTime) => {
  brush.setStyle(entity.style);
};

export const translatedView: IViewFunction = (entity, brush, deltaTime) => {
  if (!entity.style.noTranslate && entity.length && entity.x + entity.y > 0) {
    brush.translate(entity.x, entity.y);
  }
};

export const rectView: IViewFunction = (entity, brush, deltaTime) => {
  const { x, y, w, h } = entity;

  if (brush.fillStyle !== Color.None) {
    brush.fillRect(x, y, w, h);
  }

  if (brush.strokeStyle !== Color.None) {
    brush.strokeRect(x, y, w, h);
  }
};

export const ellipseView: IViewFunction = (entity, brush, deltaTime) => {
  const { x, y, w, h } = entity;

  brush
    .save()
    .translate(w / 2, h / 2)
    .beginPath()
    .ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);

  if (brush.fillStyle !== Color.None) brush.fill();
  if (brush.strokeStyle !== Color.None) brush.stroke();

  brush.restore();
};

export const defaultView: IViewFunction = (entity, brush, deltaTime) => {
  styledView(entity, brush, deltaTime);
  translatedView(entity, brush, deltaTime);
  childrenView(entity, brush, deltaTime);
};

export const sceneView: IViewFunction = (entity, brush, deltaTime) => {
  rectView(entity, brush, deltaTime);
  defaultView(entity, brush, deltaTime);
};

export const netView = (cellSize: ISizeData): IViewFunction => (
  entity,
  brush
) => {
  const { w, h } = entity;

  for (let j = 0; j < w; j += cellSize.h) {
    brush
      .beginPath()
      .moveTo(0, j)
      .lineTo(w, j)
      .closePath()
      .stroke();

    for (let i = 0; i < w; i += cellSize.w) {
      brush
        .beginPath()
        .moveTo(i, 0)
        .lineTo(i, h)
        .closePath()
        .stroke();
    }
  }
};

export const cacheView = (view: IViewFunction): IViewFunction => {
  let cache: IBrush;

  return (entity, brush, deltaTime) => {
    if (!cache) {
      cache = brush.getCacheBrush();
      view(entity, cache, deltaTime);
    }

    brush.drawCache(cache);
  };
};
