import { IEntity } from "./entity";
import { IDrawable } from "./drawable";
import { IWithParent } from "./composite";
import { IDrawer, IDrawerData } from "./drawer";

export interface IWithView {
  setView: (view: IView) => this;
}
export interface IView<T extends IEntity = IEntity>
  extends IDrawable,
    IWithParent<T> {}

export class BaseView<T extends IEntity = IEntity> implements IView<T> {
  parent: T;
  protected styles: Partial<IDrawerData> = {};

  constructor(parent: T) {
    this.parent = parent;
  }

  draw(drawer: IDrawer, deltaTime: number) {
    Object.assign(drawer, this.styles);

    return this;
  };
}
