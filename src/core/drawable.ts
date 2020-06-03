import { IBrush } from "./brush";

export interface IDrawable {
  draw(brush: IBrush, deltaTime: number): this;
}
