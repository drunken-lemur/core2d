import { assetsPath, IBrush, ITexture, removeColorOnLoad, Texture } from "core";

import { ITile } from "./tile";

export interface ITilesetImage {
  width: number;
  height: number;
  source: string;
  transparent?: string;
}

export interface ITilesetData {
  name: string;
  tilewidth: number;
  tileheight: number;
  tilecount: number;
  firstgid: number;
  columns: number;
  image: ITilesetImage;
}
export interface ITileset extends ITilesetData {
  drawTile(tile: ITile, brush: IBrush, deltaTime: number): void;
}

export class Tileset implements ITileset {
  name!: string;
  columns!: number;
  firstgid!: number;
  tilecount!: number;
  tileheight!: number;
  tilewidth!: number;
  image!: ITilesetImage;
  texture: ITexture;

  constructor(tileset: ITilesetData) {
    Object.assign(this, tileset);

    const { source, transparent } = tileset.image;
    this.texture = new Texture(assetsPath(source)).addOnLoad(
      removeColorOnLoad(transparent)
    );
  }

  get isLoaded() {
    return this.texture.isLoaded;
  }

  isTileExists(tile: ITile): boolean {
    return this.firstgid <= tile.id && this.tilecount > tile.id;
  }

  drawTile = (tile: ITile, brush: IBrush, deltaTime: number) => {
    if (!this.isTileExists(tile)) return;

    const { x, y, id } = tile;

    const { tilewidth: w, tileheight: h } = this;

    const tileCol = id % this.columns | 0;
    const tileRow = (id / this.columns) | 0;

    brush.drawImage(
      this.texture.image,
      x * w,
      y * h,
      w,
      h,
      (tileCol - 1) * w,
      tileRow * h,
      w,
      h
    );
  };
}
