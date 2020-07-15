import { IView } from "./view";
import { Color } from "./color";
import { ISizeData } from "./size";
import { Brush, IBrush } from "./brush";
import { Entity, IEntity } from "./entity";
import { IPointData, Point } from "./point";
import { Bounds, IBoundsData } from "./bounds";

export interface ITexture extends IEntity {
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

export const scaleOnLoad = (
  x: number | IPointData,
  y?: number
): OnLoad => texture => {
  texture.scale(x, y);
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
        brush
          .translate(texture)
          .drawCache(texture.brush, 0, 0, w, h, 0, 0, w, h);
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

  removeColor = (hexColor: string) => {
    if (this.isLoaded) {
      this.brush?.removeColor(hexColor);
    } else {
      this.addOnLoad(texture => texture.brush?.removeColor(hexColor));
    }

    return this;
  };

  loadFromFile = (file: string, onLoad?: OnLoad) => {
    const { image } = this;

    this.isLoaded = false;
    this.disable().hide();

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
    this.enable().show();

    console.log("Texture onLoad");

    this.onLoad.forEach(onLoad => onLoad(this));
  };

  scale = (x: number | IPointData, y?: number) => {
    // todo: apply this.viewBox support like in this.onLoadHandler
    const scale = Point.valueOf(x, y);

    if (this.isLoaded) {
      if (this.brush) {
        const { x, y, w, h } = this;

        this.brush.save();

        if (scale.x !== 1 || scale.y !== 1) {
          const translate = { x: 0, y: 0 };

          if (scale.x < 0) translate.x = -scale.x * w;
          if (scale.y < 0) translate.y = -scale.y * h;

          this.brush
            .translate(translate.x, translate.y)
            .scale(scale.x, scale.y);
        }

        this.brush
          .clear()
          .drawImage(this.image, 0, 0, w, h, x * scale.x, y * scale.y, w, h);

        this.brush.restore();
      }
    } else {
      this.addOnLoad(() => this.scale(x, y));
    }

    return this;
  };

  // todo:
  //  load and crop => texture.loadFromFile("image.png", IntRect(10, 10, 32, 32));
  //  texture.setRepeated(true);
  //  setPosition - абсолютное смещение
  //  move - относительное смещение
  //  setRotation - абсолютное
  //  rotate - относительное
  //  setScale - абсолютное
  //  scale - относительное
  //  setOrigin - Точка (началом координат)
  //  flip, rotate, scale, resize, etc.
  //  get/set viewBox?: ISizeData update brush
}
