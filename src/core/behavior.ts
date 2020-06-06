import { IEntity } from "./entity";
import { IUpdated } from "./updated";
import { IWithParent } from "./composite";

export interface IWithBehavior {
  addBehaviors: (...behaviors: IBehavior[]) => this;
  removeBehaviors: (...behaviors: IBehavior[]) => this;
}

export interface IBehaviorClass<T extends IEntity = IEntity>
  extends IUpdated,
    IWithParent<T> {}

export type IBehaviorFunction<T extends IEntity = IEntity> = (
  entity: T,
  deltaTime: number
) => void;

export type IBehavior<T extends IEntity = IEntity> =
  | IBehaviorClass<T>
  | IBehaviorFunction<T>;

export class BaseBehavior<T extends IEntity = IEntity>
  implements IBehaviorClass<T> {
  parent: T;

  constructor(parent: T) {
    this.parent = parent;
  }

  update(deltaTime: number) {
    this.parent.forEach(children => children.update(deltaTime));
  }
}

export const baseBehavior: IBehaviorFunction = (entity, deltaTime) => {
  entity.forEach(children => children.update(deltaTime));
};
