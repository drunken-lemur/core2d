import { IBehaviorFunction, IEntity } from "core";

export default undefined;

export const gravityBehavior = <T extends IEntity = IEntity>(
  gravity: number
): IBehaviorFunction<T> => (entity, deltaTime) => {
	entity.forEach(children => {
		children.y += gravity;
	});
};
