import { IEntity } from "./entity";
import { IDrawable } from "./drawable";
import { IWithParent } from "./composite";
import { IDrawer, IDrawerStyle } from "./drawer";

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

export abstract class StyledView<T extends IEntity = IEntity> extends BaseView<
  T
> {
  protected abstract style: IDrawerStyle;

  draw(drawer: IDrawer, deltaTime: number) {
    super.draw(drawer, deltaTime);

    return this;
  }
}
