import { Color } from "./color";
import { Entity } from "./entity";
import { Brush, IBrush } from "./brush";
import { IView, rectView, restoreBrushView, saveBrushView } from "./view";
import { Bounds, IBoundsData } from "./bounds";

export interface ITexture {
  loaded: boolean;
  brush?: IBrush;
  viewBox: IBoundsData;
  image: HTMLImageElement;
  loadFromFile: (file: string) => this;
}

export type OnLoad = (texture: Texture) => void;

export class Texture extends Entity implements ITexture {
  static readonly AssetsDir = "assets/";

  static loadFromFile = (
    file: string,
    viewBox?: IBoundsData,
    onLoad?: OnLoad
  ) => {
    return new Texture(file, viewBox, onLoad);
  };

  loaded = false;
  brush?: IBrush;
  viewBox: IBoundsData;
  image: HTMLImageElement;

  style = { fillStyle: Color.Red };
  views: IView<Texture>[] = [
    // rectView,
    saveBrushView,
    (texture, brush, deltaTime) => {
      const { w, h } = texture;

      if (texture.loaded && texture.brush) {
        brush.drawCache(texture.brush, 0, 0, w, h, 0, 0, w, h);
      }
    },
    (texture, brush, deltaTime) => {
      brush.setStyle({
        // fillStyle: "white",
        fillStyle: "#a4e0a0",
        globalCompositeOperation: "source-in"
      });

      rectView(texture, brush, deltaTime);
    },
    restoreBrushView
  ];

  constructor(file?: string, viewBox?: IBoundsData, onLoad?: OnLoad) {
    super();

    this.image = new Image();
    this.viewBox = viewBox!;

    if (file) this.loadFromFile(file, onLoad);
  }

  loadFromFile = (file: string, onLoad?: OnLoad) => {
    this.loaded = false;
    this.image.onload = this.onLoad(onLoad);
    this.image.src = Texture.AssetsDir + file;

    return this;
  };

  private onLoad = (onLoad?: OnLoad) => () => {
    const { image } = this;

    if (!this.viewBox) {
      this.viewBox = Bounds.valueOf(0, 0, image.width, image.height);
    } else {
      if (!this.viewBox.w) this.viewBox.w = image.width - this.viewBox.x;
      if (!this.viewBox.h) this.viewBox.h = image.height - this.viewBox.y;
      if (this.viewBox.w < 0) {
        this.viewBox.w = image.width + this.viewBox.w - this.viewBox.x;
      }
      if (this.viewBox.h < 0) {
        this.viewBox.h = image.height + this.viewBox.h - this.viewBox.y;
      }
    }

    this.setSize(this.viewBox);

    const { viewBox } = this;
    this.brush = Brush.create(this).drawImage(
      this.image,
      viewBox.x,
      viewBox.y,
      viewBox.w,
      viewBox.h,
      0,
      0,
      viewBox.w,
      viewBox.h
    );

    this.loaded = true;
    if (onLoad) onLoad(this);
  };

  // todo: flip, rotate, scale, resize, etc.
  // todo: get/set viewBox?: ISizeData update brush
}
