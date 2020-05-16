import { IDrawer } from "./drawer";

export interface IDrawable {
  draw(drawer: IDrawer, deltaTime: number): this;
}
