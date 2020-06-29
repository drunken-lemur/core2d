import {
  assetsPath,
  defaultBehavior,
  defaultView,
  Entity,
  IBehaviors,
  IBrush,
  IPointData,
  ITexture,
  IViews,
  removeColorOnLoad,
  Texture
} from "core";
import { gravityBehavior, loadTiledMap } from "lib";

export interface ITilesetImage {
  width: number;
  height: number;
  source: string;
  transparent?: string;
}

export interface ITileset {
  name: string;
  tilewidth: number;
  tileheight: number;
  tilecount: number;
  firstgid: number;
  columns: number;
  image: ITilesetImage;
}

export interface ITiledMapLayer {
  id: number;
  name: string;
  width: number;
  height: number;
  data: number[][];
}

export interface ITiledMap {
  tilesets: ITileset[];
  layers: ITiledMapLayer[];
}

export interface ITile {
  id: number;
  position: IPointData;
}

class Tileset implements ITileset {
  name!: string;
  columns!: number;
  firstgid!: number;
  tilecount!: number;
  tileheight!: number;
  tilewidth!: number;
  image!: ITilesetImage;
  texture: ITexture;

  constructor(tileset: ITileset) {
    Object.assign(this, tileset);

    const { source, transparent } = tileset.image;
    this.texture = new Texture(assetsPath(source)).addOnLoad(
      removeColorOnLoad(transparent)
    );
  }

  get isLoaded() {
    return this.texture.isLoaded;
  }

  drawTile = (tile: ITile, brush: IBrush, deltaTime: number) => {
    const {
      id,
      position: { x, y }
    } = tile;
    const { tilewidth, tileheight } = this;

    const tileCol = id % this.columns | 0;
    const tileRow = (id / this.columns) | 0; // Bitwise OR operation

    // brush
    //   .setStyle({ fillStyle: "pink" })
    //   .fillRect(x * tilewidth, y * tileheight, tilewidth, tileheight);

    brush.drawImage(
      this.texture.image,
      (tileCol - 1) * tilewidth,
      tileRow * tileheight,
      tilewidth,
      tileheight,
      x * tilewidth,
      y * tileheight,
      tilewidth,
      tileheight
    );
  };
}

export class TiledMap extends Entity implements ITiledMap {
  private static DefaultGravity = 0.9;

  tilesets: Tileset[];
  layers!: ITiledMapLayer[];
  views: IViews<TiledMap> = [
    (map, brush, deltaTime) => {
      const { layers, tilesets } = map;

      if (layers) {
        layers.forEach(layer => {
          const { width, height, data } = layer;

          for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
              const tileId = data[row][col];

              tilesets.forEach(tileset => {
                if (tileset.firstgid <= tileId && tileset.tilecount > tileId) {
                  const tile: ITile = {
                    id: tileId,
                    position: { x: col, y: row }
                  };

                  tileset.drawTile(tile, brush, deltaTime);
                }
              });
            }
          }
        });
      }
    },
    defaultView
  ];
  behaviors: IBehaviors<TiledMap> = [
    defaultBehavior,
    gravityBehavior(TiledMap.DefaultGravity),
    map => {
      map.forEach(children => {

        // todo: calc collisions
      })
    }
  ];

  constructor(mapFile: string) {
    super();

    this.tilesets = [];
    // noinspection JSIgnoredPromiseFromCall
    this.load(mapFile);
  }

  private load = async (mapFile: string) => {
    const { tilesets, layers } = await loadTiledMap(mapFile);

    this.layers = layers;

    tilesets.forEach(tileset => {
      this.tilesets.push(new Tileset(tileset));
    });
  };
}
