import { Color } from "./color";
import { IScene } from "./scene";
import { Size, ISize, ISizeData } from "./size";

export const Resolutions = {
  $4x3: {
    $320x240: new Size(320, 240),
    $512x384: new Size(512, 384),
    $640x480: new Size(640, 480),
    $800x600: new Size(800, 600),
    $1024x768: new Size(1024, 768),
    $1280x960: new Size(1280, 960),
    $1400x1050: new Size(1400, 1050),
    $1600x1200: new Size(1600, 1200),
    $1920x1440: new Size(1920, 1440),
    $2048x1536: new Size(2048, 1536)
  },
  $8x5: {
    $640x400: new Size(640, 400),
    $1152x720: new Size(1152, 720),
    $1280x800: new Size(1280, 800),
    $1440x900: new Size(1440, 900),
    $1680x1050: new Size(1680, 1050),
    $1920x1200: new Size(1920, 1200),
    $2560x1600: new Size(2560, 1600)
  },
  $16x9: {
    $1360x768: new Size(1360, 768),
    $1600x900: new Size(1600, 900),
    $1920x1080: new Size(1920, 1080),
    $2560x1440: new Size(2560, 1440)
  }
};

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
