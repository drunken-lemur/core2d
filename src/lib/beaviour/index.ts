import { IBehaviorFunction, IEntity, IVelocity } from "core";

export default undefined;

export const gravityBehavior = <T extends IEntity = IEntity>(
  gravity: number
): IBehaviorFunction<T> => (entity, deltaTime) => {
  entity.forEach<IVelocity>(children => {
    if (children.velocity) children.velocity.y += gravity;
  });
};
