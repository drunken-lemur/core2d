import {
  Color,
  Entity,
  IBoundsData,
  IPointData,
  ISizeData,
  ITexture,
  IView,
  setSizeOnLoad
} from "core";

export type ILayer = number[][];

export class TilesetMap extends Entity {
  layers: ILayer[] = [];

  style = { fillStyle: Color.Gray };
  views: IView<TilesetMap>[] = [
    (tilesetMap, brush, deltaTime) => {
      const {
        rowTileCount,
        colTileCount,
        layers,
        imageNumTiles,
        tileSize,
        texture: { image }
      } = tilesetMap;

      layers.forEach(layer => {
        for (let row = 0; row < rowTileCount; row++) {
          for (let col = 0; col < colTileCount; col++) {
            const tile = layer[row][col];
            const tileCol = tile % imageNumTiles | 0;
            const tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation

            brush.drawImage(
              image,
              tileCol * tileSize,
              tileRow * tileSize,
              tileSize,
              tileSize,
              col * tileSize,
              row * tileSize,
              tileSize,
              tileSize
            );
          }
        }
      });
    }
  ];

  private texture: ITexture;

  // todo: remove hard code => move to constructor or getter / setter
  private tileSize = 32; // The size of a tile (32x32)
  private rowTileCount = 20; // The number of tiles in a row of our background
  private colTileCount = 32; // The number of tiles in a column of our background
  private imageNumTiles = 16; // The number of tiles per row in the tileset image

  constructor(
    texture: ITexture,
    bounds?: IPointData | ISizeData | IBoundsData
  ) {
    super(bounds);

    this.texture = texture.addOnLoad(setSizeOnLoad(this));
  }

  addLayers = (...layers: ILayer[]) => {
    layers.forEach(layer => this.layers.push(layer));

    return this;
  };
}
