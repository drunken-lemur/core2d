export interface ITexture {
  loaded: boolean;
  image: HTMLImageElement;
  loadFromFile: (file: string) => this;
}

export type OnLoad = (texture: Texture) => void;

export class Texture implements ITexture {
  static readonly AssetsDir = "assets/";

  static loadFromFile = (file: string, onLoad?: OnLoad) => {
    return new Texture(file, onLoad);
  };

  loaded = false;
  image: HTMLImageElement;

  constructor(file?: string, onLoad?: OnLoad) {
    this.image = new Image();

    if (file) {
      this.loadFromFile(file, onLoad);
    }
  }

  loadFromFile = (file: string, onLoad?: OnLoad) => {
    this.image.onload = () => {
      this.loaded = true;

      if (onLoad) onLoad(this);
    };

    this.loaded = false;
    this.image.src = Texture.AssetsDir + file;

    return this;
  };
}
