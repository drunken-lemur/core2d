import { IEntity, IVelocity, moveByVelocityBehavior, Point } from "core";

export const velocityDecorator = <T extends IEntity>(
  entity: T
): T & IVelocity => {
  const decorated: T & IVelocity = entity;

  decorated.velocity = Point.valueOf();
  decorated.addBehaviors(moveByVelocityBehavior);

  return decorated;
};
