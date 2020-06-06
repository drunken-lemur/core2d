import { IBrush } from "./brush";
import { IEntity } from "core/entity";

export interface IDrawable {
  draw(brush: IBrush, deltaTime: number): this;
}

export interface IDrawableFunction {
  (entity: IEntity, brush: IBrush, deltaTime: number): void;
}
