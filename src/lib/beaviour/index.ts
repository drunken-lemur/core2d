import { IBehaviorFunction, IEntity, IVelocity } from "core";

export default undefined;

export const gravityBehavior = <T extends IEntity = IEntity>(
  gravity: number,
  maxVelocity?: number
): IBehaviorFunction<T> => (entity, deltaTime) => {
  entity.forEach<IVelocity>(children => {
    if (children.velocity) {
      children.velocity.y += gravity;
      if (maxVelocity && children.velocity.y > maxVelocity) {
        children.velocity.y = maxVelocity;
      }
    }
  });
};
