import { IEntity } from "./entity";
import { IUpdated } from "./updated";
import { IWithParent } from "./composite";

export interface IWithBehavior {
  setBehavior: (behavior: IBehavior) => this;
}

export interface IBehavior<T extends IEntity = IEntity>
  extends IUpdated,
    IWithParent<T> {}

export class BaseBehavior<T extends IEntity = IEntity> implements IBehavior<T> {
  parent: T;

  constructor(parent: T) {
    this.parent = parent;
  }

  update(deltaTime: number) {
    this.parent.forEach(children => children.update(deltaTime));

    return this;
  }
}
