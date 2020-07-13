import { Key } from "./input";
import { Delay } from "./delay";
import { IEntity } from "./entity";
import { IUpdated } from "./updated";
import { IWithParent } from "./composite";
import { IPointData } from "core/point";

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

export type IBehaviors<T extends IEntity = IEntity> = IBehavior<T>[];

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
  const { parent } = entity;

  if (parent) {
    if (entity.x > parent.w) entity.x = -entity.w;
    if (entity.x < -entity.w) entity.x = parent.w;
    if (entity.y > parent.h) entity.y = -entity.h;
    if (entity.y < -entity.h) entity.y = parent.h;
  }
};

export const removeAfterDelayBehavior = (
  delaySec: number
): IBehaviorFunction => {
  const delay = new Delay(delaySec);

  return (entity, deltaTime) => {
    delay.update(deltaTime);

    if (delay.isDone) {
      entity.remove();
    }
  };
};

export const moveByKeyboard = (
  fn: (...keys: Key[]) => boolean,
  speed: number,
  up: Key,
  left: Key,
  down: Key,
  right: Key
): IBehaviorFunction => {
  return (entity, deltaTime) => {
    if (fn(up)) entity.y -= speed * deltaTime;
    if (fn(left)) entity.x -= speed * deltaTime;
    if (fn(down)) entity.y += speed * deltaTime;
    if (fn(right)) entity.x += speed * deltaTime;
  };
};

export const borderBouncingBehavior = (
  onBorder: () => void = () => void 0,
  speed: IPointData = { x: 1, y: 1 }
): IBehaviorFunction => {
  return (entity, deltaTime) => {
    const parent = entity.parent!;

    if (entity.x < parent.x) {
      speed.x = 1;
      onBorder();
    }

    if (entity.x + entity.w > parent.x + parent.w) {
      speed.x = -1;
      onBorder();
    }

    if (entity.y < parent.y) {
      speed.y = 1;
      onBorder();
    }

    if (entity.y + entity.h > parent.y + parent.h) {
      speed.y = -1;
      onBorder();
    }

    entity.plusPosition(speed);
  };
};

export const intervalBehavior = <T extends IEntity = IEntity>(
  delaySec: number
) => (behavior: IBehaviorFunction<T>): IBehaviorFunction<T> => {
  const delay = new Delay(delaySec);

  return (entity, deltaTime) => {
    delay.update(deltaTime);

    if (delay.isDone) {
      delay.reset();

      behavior(entity, deltaTime);
    }
  };
};

export const floorSizeBehavior: IBehaviorFunction = (entity, deltaTime) => {
  entity.floorSize();
};

export const floorPositionBehavior: IBehaviorFunction = (entity, deltaTime) => {
  entity.floorPosition();
};

export const floorBoundsBehavior: IBehaviorFunction = (entity, deltaTime) => {
  entity.floorBounds();
};

export const foreachBehavior = <T extends IEntity = IEntity>(
  behavior: IBehaviorFunction<T>
): IBehaviorFunction<T> => (entity, deltaTime) => {
  entity.forEach<T>(children => {
    if (children.isEnabled()) {
      behavior(children, deltaTime);
    }
  });
};

export const onOutInOfBoundsBehavior = <T extends IEntity = IEntity>(
  onOut: IBehaviorFunction<IEntity & T>,
  onIn?: IBehaviorFunction<IEntity & T>
): IBehaviorFunction<IEntity & T> => {
  let isInBoxLast: boolean | null = null;

  return (entity, deltaTime) => {
    if (entity.parent) {
      const isInBox = entity.parent.isIntersect(entity);

      if (isInBox !== isInBoxLast) {
        if (isInBox) {
          onIn && onIn(entity, deltaTime);
        } else {
          onOut(entity, deltaTime);
        }

        isInBoxLast = isInBox;
      }
    }
  };
};

export const hideOnOutOfBoundsBehavior = onOutInOfBoundsBehavior(
  e => e.hide(),
  e => e.show()
);
