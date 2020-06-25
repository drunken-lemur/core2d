import { Color } from "./color";
import { Entity, IEntity } from "./entity";
import { Brush, IBrush } from "./brush";
import { IView, rectView, restoreBrushView, saveBrushView } from "./view";
import { Bounds, IBoundsData } from "./bounds";
import { ISize, ISizeData } from "core/size";

export interface ITexture {
  isLoaded: boolean;
  brush?: IBrush;
  viewBox: IBoundsData;
  image: HTMLImageElement;
  loadFromFile: (file: string) => this;
  addOnLoad: (...onLoads: OnLoad[]) => this;
  removeColor: (hexColor: string) => this;
}

export type OnLoad = (texture: Texture) => void;

export const setSizeOnLoad = (
  size: IBoundsData | ISizeData
): OnLoad => texture => {
  const { width, height } = texture?.image!;

  size.w = width;
  size.h = height;
};

export const removeColorOnLoad = (color?: string): OnLoad => texture => {
  if (color) texture.brush?.removeColor(color);
};

export class Texture extends Entity implements ITexture {
  isLoaded = false;
  brush?: IBrush;
  viewBox: IBoundsData;
  image: HTMLImageElement;
  onLoad: OnLoad[] = [];
  style = { fillStyle: Color.Red };
  views: IView<Texture>[] = [
    (texture, brush, deltaTime) => {
      const { w, h } = texture;

      if (texture.isLoaded && texture.brush) {
        brush.drawCache(texture.brush, 0, 0, w, h, 0, 0, w, h);
      }
    }
  ];

  constructor(file?: string, viewBox?: IBoundsData, onLoad?: OnLoad) {
    super();

    this.image = new Image();
    this.viewBox = viewBox!;

    if (file) this.loadFromFile(file, onLoad);
  }

  static loadFromFile = (
    file: string,
    viewBox?: IBoundsData,
    onLoad?: OnLoad
  ) => {
    return new Texture(file, viewBox, onLoad);
  };

  loadFromFile = (file: string, onLoad?: OnLoad) => {
    const { image } = this;

    this.isLoaded = false;

    if (onLoad) this.onLoad = [onLoad];

    image.onerror = () => {
      throw new Error(`Failed to load texture ${file}`);
    };
    image.onload = this.onLoadHandler;
    image.src = file;

    return this;
  };

  addOnLoad = (...onLoads: OnLoad[]) => {
    onLoads.forEach(onLoad => {
      this.onLoad.push(onLoad);

      if (this.isLoaded) onLoad(this);
    });

    return this;
  };

  removeColor = (hexColor: string) => {
    if (this.isLoaded) {
      this.brush?.removeColor(hexColor);
    } else {
      this.addOnLoad(texture => texture.removeColor(hexColor));
    }

    return this;
  };

  private onLoadHandler = () => {
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

    this.isLoaded = true;

    this.onLoad.forEach(onLoad => onLoad(this));
  };

  // todo: flip, rotate, scale, resize, etc.
  // todo: get/set viewBox?: ISizeData update brush
}
