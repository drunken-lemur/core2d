import { Delay } from "./delay";
import { IEntity } from "./entity";
import { IUpdated } from "./updated";
import { IWithParent } from "./composite";

export interface IWithBehavior {
  addBehaviors: (...behaviors: IBehavior[]) => this;
  setBehaviors: (...behaviors: IBehavior[]) => this;
  removeBehaviors: (...behaviors: IBehavior[]) => this;
  clearBehaviors: () => this;
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

export const childrenBehavior: IBehaviorFunction = (entity, deltaTime) => {
  entity.forEach(children => children.update(deltaTime));
};

export const defaultBehavior: IBehaviorFunction = (entity, deltaTime) => {
  childrenBehavior(entity, deltaTime);
};

export const sceneBehavior: IBehaviorFunction = (entity, deltaTime) => {
  defaultBehavior(entity, deltaTime);
};

export const parentSphereBehavior: IBehaviorFunction = (entity, deltaTime) => {
  const parent = entity.parent!;

  if (entity.x > parent.w) entity.x = -entity.w;
  if (entity.x < -entity.w) entity.x = parent.w;
  if (entity.y > parent.h) entity.y = -entity.h;
  if (entity.y < -entity.h) entity.y = parent.h;
};

export const removeAfterDelayBehavior = (
  delaySec: number
): IBehaviorFunction => (entity, deltaTime) => {
  const delay = new Delay(delaySec);
  console.log("removeAfterDelayBehavior", { deltaTime });

  const behavior: IBehaviorFunction = (entity, deltaTime) => {
    delay.update(deltaTime);

    console.log("removeAfterDelayBehavior.behavior", {delay});

    if (delay.isDone) {
      entity.remove();
    }
  };

  return behavior;
};
