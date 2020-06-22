import { Color, ISizeData, Texture } from "core";

export interface ITilesetFile {
  tiledversion: string;
  version: number;
  type: string;

  name: string;
  image: string;
  imagewidth: number;
  imageheight: number;

  tilecount: number;
  tilewidth: number;
  tileheight: number;

  margin: number;
  spacing: number;

  columns: number;
}

const tileFileExample: ITilesetFile = {
  columns: 33,
  image:
    "../Documents/Projects/js/core2d/public/assets/NES - Super Mario Bros - Tileset.png",
  imageheight: 448,
  imagewidth: 528,
  margin: 0,
  name: "Mario",
  spacing: 0,
  tilecount: 924,
  tiledversion: "1.3.5",
  tileheight: 16,
  tilewidth: 16,
  type: "tileset",
  version: 1.2
};

export class Tileset extends Texture {
  margin: number;
  spacing: number;
  tileSize: ISizeData;
  transparentColor: Color;
}
