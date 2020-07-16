import {
  assetsPath,
  Color,
  defaultBehavior,
  defaultView,
  Entity,
  floorBoundsBehavior,
  floorPositionBehavior,
  foreachBehavior,
  IBehaviors,
  IBrush,
  IEntity,
  intervalBehavior,
  IPointData,
  ITexture,
  IVelocity,
  IViews,
  netView,
  removeColorOnLoad,
  Size,
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
  data: ITile[][];
}

export interface ITiledMap {
  tilesets: ITileset[];
  layers: ITiledMapLayer[];
}

export type ITile = number;

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

  drawTile = (
    id: number,
    x: number,
    y: number,
    brush: IBrush,
    deltaTime: number
  ) => {
    const { tilewidth, tileheight } = this;

    const tileCol = id % this.columns | 0;
    const tileRow = (id / this.columns) | 0; // Bitwise OR operation

    brush.drawImage(
      this.texture.image,
      x * tilewidth,
      y * tileheight,
      tilewidth,
      tileheight,
      (tileCol - 1) * tilewidth,
      tileRow * tileheight,
      tilewidth,
      tileheight
    );
  };
}

export class TiledMap extends Entity implements ITiledMap {
  private static DefaultGravity = 0.3;

  style = { strokeStyle: Color.Black };

  tilesets: Tileset[];
  layers: ITiledMapLayer[];
  views: IViews<TiledMap> = [
    (map, brush, deltaTime) => {
      const { layers, tilesets } = map;

      layers.forEach(layer => {
        const { data } = layer;

        data.forEach((row, y) =>
          row.forEach((id, x) => {
            tilesets.forEach(tileset => {
              if (tileset.firstgid <= id && tileset.tilecount > id) {
                tileset.drawTile(id, x, y, brush, deltaTime);
              }
            });
          })
        );
      });
    },
    defaultView
    // netView(Size.valueOf(16))
  ];
  behaviors: IBehaviors<TiledMap> = [
    defaultBehavior,
    gravityBehavior(TiledMap.DefaultGravity),
    map =>
      map.forEach<IVelocity>(children => {
        const { velocity } = children;

        if (velocity) {
          children.y += velocity.y;
          const {
            TopLeft,
            TopRight,
            BottomLeft,
            BottomRight
          } = children.getCorners();
          const topLeft = map.getTileByPosition(TopLeft);
          const topRight = map.getTileByPosition(TopRight);
          const bottomLeft = map.getTileByPosition(BottomLeft);
          const bottomRight = map.getTileByPosition(BottomRight);
          children.y -= velocity.y;

          if (velocity.y < 0) {
            if (topLeft || topRight) velocity.y = 0;
          } else if (velocity.y > 0) {
            if (bottomLeft || bottomRight) velocity.y = 0;
          }

          children.y += velocity.y;
        }
      }),
    map =>
      map.forEach<IVelocity>(children => {
        const { velocity } = children;

        if (velocity) {
          children.x += velocity.x;
          const {
            TopLeft,
            TopRight,
            BottomLeft,
            BottomRight
          } = children.getCorners();
          const topLeft = map.getTileByPosition(TopLeft);
          const topRight = map.getTileByPosition(TopRight);
          const bottomLeft = map.getTileByPosition(BottomLeft);
          const bottomRight = map.getTileByPosition(BottomRight);
          children.x -= velocity.x;

          if (velocity.x < 0) {
            if (topLeft || bottomLeft) velocity.x = 0;
          } else if (velocity.x > 0) {
            if (topRight || bottomRight) velocity.x = 0;
          }

          children.x += velocity.x;
        }
      }),
    map =>
      0 &&
      map.forEach<IVelocity>(children => {
        if (children.velocity) {
          const { velocity } = children;
          children.plusPosition(velocity);

          const {
            TopLeft,
            TopRight,
            BottomLeft,
            BottomRight
          } = children.getCorners();
          const topLeft = map.getTileByPosition(TopLeft);
          const topRight = map.getTileByPosition(TopRight);
          const bottomLeft = map.getTileByPosition(BottomLeft);
          const bottomRight = map.getTileByPosition(BottomRight);
          children.minusPosition(velocity);

          if (topLeft || bottomLeft) children.velocity.x = 0;
          if (topRight || bottomRight) children.velocity.x = 0;
          if (topLeft || topRight) children.velocity.y = 0;
          if (bottomLeft || bottomRight) children.velocity.y = 0;
        }
      }),
    foreachBehavior(floorPositionBehavior)
  ];

  private mainLayerName: string;
  private mainTilesetName: string;
  private player?: IEntity;

  constructor(mapFile: string, mainLayerName = "", mainTilesetName = "") {
    super();

    this.layers = [];
    this.tilesets = [];
    this.mainLayerName = mainLayerName;
    this.mainTilesetName = mainTilesetName;

    this.disable().hide();

    // noinspection JSIgnoredPromiseFromCall
    this.load(mapFile);
  }

  get cellSize() {
    // todo refine it
    const { mainTilesetName, tilesets } = this;
    const [tileset] = mainTilesetName
      ? tilesets.filter(({ name }) => name === mainTilesetName)
      : tilesets;

    return Size.valueOf(tileset?.tilewidth || 0, tileset?.tilewidth || 0);
  }

  setPlayer(player: IEntity) {
    this.player = player;

    this.delete(player).add(player);

    return this;
  }

  getTileByPosition = ({ x, y }: IPointData, layerName?: string): ITile => {
    const { mainLayerName, layers, cellSize } = this;
    const ln = layerName || mainLayerName;
    const [layer] = mainLayerName
      ? layers.filter(({ name }) => name === ln)
      : layers;

    if (!layer || x < 0 || y < 0) return 0;

    const { data } = layer;
    const col = (x / cellSize.w) | 0;
    const row = (y / cellSize.h) | 0;

    return (data[row] && data[row][col]) || 0;
  };

  private load = async (mapFile: string) => {
    const { tilesets, layers } = await loadTiledMap(mapFile);

    this.layers = layers;

    tilesets.forEach(tileset => this.tilesets.push(new Tileset(tileset)));

    // todo: refine hardcode this.layers[0] & this.tilesets[0]
    const [layer] = this.layers;
    const [tileset] = this.tilesets;
    if (layer && tileset) {
      this.setSize(
        layer.width * tileset.tilewidth,
        layer.height * tileset.tileheight
      );
    }

    this.enable().show();
  };
}

// todo: remove
const example = {
  tilesets: [
    {
      name: "Tileset",
      tilewidth: 16,
      tileheight: 16,
      tilecount: 924,
      firstgid: 1,
      columns: 33,
      image: {
        transparent: null,
        width: 528,
        height: 448,
        source: "/images/tilesets/mario/tileset.png"
      }
    },
    {
      name: "World 1-1",
      tilewidth: 16,
      tileheight: 16,
      tilecount: 2743,
      firstgid: 925,
      columns: 211,
      image: {
        transparent: null,
        width: 3392,
        height: 232,
        source: "/images/tilesets/mario/world-1-1-1.png"
      }
    }
  ],
  layers: [
    {
      name: "Background",
      data: [],
      id: 1,
      width: 212,
      height: 15
    },
    {
      name: "World",
      data: [],
      id: 2,
      width: 212,
      height: 15
    }
  ]
};
