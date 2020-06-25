import { Color, IBoundsData, ISizeData, Texture } from "core";
import { loadTiledMap } from "lib/utils";

export class Tileset extends Texture {
  margin!: number;
  spacing!: number;
  tileSize!: ISizeData;
  transparentColor!: Color;

  constructor(file: string) {
    super(file);
  }
}

// (async () => {
//   const response = await fetch("/assets/maps/mario/world-1-1.json");
//   const mapData: ITilesetMapFile = await response.json();
//
//   mapData.layers.filter(layer => layer.type === "tilelayer").map(console.log);
//
//   // console.log("world-1-1.json", mapData.layers);
// })();

// loadTiledMap("mario/world-1-1.tmx").then(console.log);
