import { Color } from "./color";
import { IScene } from "./scene";
import { Size, ISize, ISizeData } from "./size";

export interface IScreen extends ISize {
  fill: () => void;
  clean: () => void;
  render: (scene: IScene, deltaTime: number) => void;
}

export abstract class BaseScreen extends Size implements IScreen {
  abstract fill: () => void;

  abstract clean: () => void;

  abstract render: (scene: IScene, deltaTime: number) => void;
}

export class CanvasScreen extends BaseScreen {
  protected readonly canvas: HTMLCanvasElement;
  protected readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, size?: ISizeData) {
    super(size);

    this.canvas = canvas;
    this.canvas.width = this.w;
    this.canvas.height = this.h;

    this.ctx = this.canvas.getContext("2d")!;

    if (!this.ctx) {
      throw new Error("Canvas context not found!");
    }
  }

  render = (scene: IScene, deltaTime: number) => {
    scene.draw(this.ctx!, deltaTime);
  };

  fill = () => {
    this.ctx.save();
    this.ctx.fillStyle = Color.White;
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.restore();
  };

  clean = () => this.ctx.clearRect(0, 0, this.w, this.h);
}
