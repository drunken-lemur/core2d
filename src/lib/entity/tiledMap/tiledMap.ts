import {
  Bounds,
  Color,
  defaultBehavior,
  defaultView,
  Entity,
  floorPositionBehavior,
  foreachBehavior,
  IBehaviors,
  IBrush,
  IEntity,
  IPointData,
  IVelocity,
  IViews,
  Point,
  Position,
  rectView,
  Size
} from "core";
import { bindMethods, fetchXml, gravityBehavior, Label } from "lib";

import { ITile } from "./tile";
import { ITileset, Tileset } from "./tileset";

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

export class TiledMap extends Entity implements ITiledMap {
  private static DefaultGravity = 0.03;

  style = { strokeStyle: Color.Black };

  tilesets: ITileset[];
  layers: ITiledMapLayer[];
  views: IViews<TiledMap> = [TiledMap.drawTiles, defaultView];
  behaviors: IBehaviors<TiledMap> = [
    defaultBehavior,
    gravityBehavior(TiledMap.DefaultGravity),
    TiledMap.processCollisions,
    foreachBehavior(floorPositionBehavior)
  ];

  private testLabel = new Label().setStyle({
    font: `${14}px Verdana`,
    fillStyle: Color.White,
    textAlign: "left",
    textBaseline: "middle"
  });
  private top = new Entity();
  private right = new Entity();
  private bottom = new Entity().setBounds(16, 16, 16, 16);
  private left = new Entity();

  private readonly mainLayerName: string;
  private mainTilesetName: string;
  private mainLayer?: ITiledMapLayer;
  private mainTileset?: ITileset;
  private player?: IEntity;

  constructor(mapFile: string, mainLayerName = "", mainTilesetName = "") {
    super();

    this.layers = [];
    this.tilesets = [];
    this.mainLayerName = mainLayerName;
    this.mainTilesetName = mainTilesetName;

    this.disable().hide();

    bindMethods(this, this.fromCell, this.toCell);

    // noinspection JSIgnoredPromiseFromCall
    this.load(mapFile);

    const { top, right, bottom, left } = this;
    [top, right, bottom, left].forEach(block =>
      this.add(
        block
          .setStyle({
            fillStyle: Color.Green
          })
          .addViews(rectView)
      )
    );
  }

  get cellSize() {
    const { mainTileset } = this;

    if (mainTileset) {
      return Size.valueOf(mainTileset.tilewidth, mainTileset.tileheight);
    }

    return Size.valueOf(1);
  }

  private static drawTiles(map: TiledMap, brush: IBrush, deltaTime: number) {
    const { layers, tilesets } = map;

    layers.forEach(({ data }) => {
      data.forEach(row =>
        row.forEach(tile => {
          tilesets.forEach(tileset => {
            tileset.drawTile(tile, brush, deltaTime);
          });
        })
      );
    });
  }

  private static processCollisions(map: TiledMap) {
    map.forEach<IVelocity>(children => {
      // - - - \\

      const { velocity } = children;

      if (!velocity) return;

      children.y += velocity.y;
      const isTopWall = map.isWall(children, Position.Top);
      const isBottomWall = map.isWall(children, Position.Bottom);
      children.y -= velocity.y;

      if (velocity.y < 0) {
        if (isTopWall) velocity.y = 0;
      } else if (velocity.y > 0) {
        if (isBottomWall) velocity.y = 0;
      }

      children.y += velocity.y;
    });

    const { player, testLabel, cellSize } = map;

    if (player) {
      const { top, right, bottom, left } = map;

      const corners = player.cloneBounds().getCorners();
      const topLeft = corners[Position.TopLeft];
      const topRight = corners[Position.TopRight];
      const bottomRight = corners[Position.BottomRight];
      const bottomLeft = corners[Position.BottomLeft];

      testLabel.text = JSON.stringify({
        topRight,
        bottomRight,
        player: player.getBounds()
      });

      top
        .setPosition(topLeft.x, topLeft.y - cellSize.h)
        .setSize(bottomRight.x - bottomLeft.x, cellSize.h);
      right
        .setPosition(topRight)
        .setSize(cellSize.w, bottomRight.y - topRight.y);
      bottom
        .setPosition(bottomLeft)
        .setSize(bottomRight.x - bottomLeft.x, cellSize.h);
      left
        .setPosition(topLeft.x - cellSize.w, topLeft.y)
        .setSize(cellSize.w, bottomRight.y - topRight.y);
    }
  }

  private static async load(mapFile: string) {
    const mapXml = await fetchXml(`/assets/maps/${mapFile}`);
    const map = TiledMap.parseMapXml(mapXml);

    const layers = map.layers;

    const tilesets = await Promise.all(
      map.tilesets.map(async tileset => {
        const { firstgid, source } = tileset;
        const tilesetFile = `${source}`.replace("../..", "/assets");
        const tilesetXml = await fetchXml(tilesetFile);

        return TiledMap.parseTilesetXml(tilesetXml, firstgid);
      })
    );

    return { layers, tilesets };
  }

  private static parseMapXml(mapXml: Document) {
    const tilesets = Array.from(mapXml.querySelectorAll("tileset")).map(
      tileset => ({
        source: tileset.getAttribute("source") || "",
        firstgid: tileset.getAttribute("firstgid") || ""
      })
    );
    const layers = mapXml.querySelectorAll("layer");
    const layersData = Array.from(layers).map(layer => {
      const id = layer.getAttribute("id") || "";
      const name = layer.getAttribute("name") || "";
      const width = layer.getAttribute("width") || "";
      const height = layer.getAttribute("height") || "";

      const dataElement = layer.querySelector("data") || "";

      const data: ITile[][] = [];
      if (dataElement) {
        dataElement.innerHTML
          .trim()
          .split("\n")
          .map(row =>
            row
              .replace(/,$/, "")
              .split(",")
              .map(Number)
          )
          .forEach((row, y) => {
            data.push(row.map((id, x) => ({ id, x, y })));
          });
      }

      return {
        name,
        data,
        id: parseInt(`${id}`),
        width: parseInt(`${width}`),
        height: parseInt(`${height}`)
      };
    });

    return { tilesets, layers: layersData };
  }

  private static parseTilesetXml(tilesetXml: Document, firstgid: string) {
    const tileset = tilesetXml.querySelector("tileset")!;
    const name = tileset.getAttribute("name") || "";
    const tilewidth = tileset.getAttribute("tilewidth") || "";
    const tileheight = tileset.getAttribute("tileheight") || "";
    const tilecount = tileset.getAttribute("tilecount") || "";
    const columns = tileset.getAttribute("columns") || "";

    const image = tilesetXml.querySelector("tileset image")!;
    const source = image.getAttribute("source") || "";
    const width = image.getAttribute("width") || "";
    const height = image.getAttribute("height") || "";
    const transparent = image.getAttribute("trans") || "";

    return {
      name,
      tilewidth: parseInt(`${tilewidth}`),
      tileheight: parseInt(`${tileheight}`),
      tilecount: parseInt(`${tilecount}`),
      firstgid: parseInt(`${firstgid}`),
      columns: parseInt(`${columns}`),
      image: {
        transparent,
        width: parseInt(`${width}`),
        height: parseInt(`${height}`),
        source: `${source}`.replace("../..", "")
      }
    };
  }

  setPlayer(player: IEntity) {
    this.player = player;

    this.delete(player).add(player);

    return this;
  }

  getTileByPosition = (point: IPointData, layerName?: string): ITile | null => {
    const { x, y } = this.toCell(point);
    const layer = this.getLayer(layerName);

    if (!layer || point.x < 0 || point.y < 0) return null;

    return (layer.data[y] && layer.data[y][x]) || null;
  };

  toCell(x: number | IPointData, y?: number): IPointData {
    const { w, h } = this.cellSize;
    const point = Point.valueOf(x, y);

    return Point.valueOf(point.x / w, point.y / h);
  }

  fromCell(x: number | IPointData, y?: number): IPointData {
    const { w, h } = this.cellSize;
    const point = Point.valueOf(x, y);

    return Point.valueOf(point.x * w, point.y * h);
  }

  isWall(entity: IEntity, position: Position, align = false): boolean {
    const { cellSize, toCell, fromCell } = this;

    const bounds = entity
      .cloneBounds()
      .divideBounds(cellSize.w, cellSize.h)
      .floorBounds();
    const corners = entity.getCorners();

    const topLeft = corners[Position.BottomLeft];
    const topRight = corners[Position.BottomRight];
    const bottomRight = corners[Position.BottomRight];
    const bottomLeft = corners[Position.BottomLeft];

    // const helpers: Partial<Record<Position, () => boolean>> = {
    //   [Position.Top]: this.isWallTop,
    //   [Position.Right]: this.isWallRight,
    //   [Position.BottomLeft]: this.isWallBottom,
    //   [Position.Left]: this.isWallLeft,
    // };

    if (position === Position.Top) {
      return this.isWallTop();
      for (let x = topLeft.x; x < topRight.x; x += cellSize.w) {
        if (this.getTileByPosition({ x, y: topLeft.y })) return true;
      }
    } else if (position === Position.Right) {
      return this.isWallRight();
      for (let y = topRight.y; y < bottomRight.y; y += cellSize.h) {
        if (this.getTileByPosition({ x: topRight.x, y })) return true;
      }
    } else if (position === Position.Bottom) {
      return this.isWallBottom();
      const from = fromCell(toCell(bottomLeft));

      for (let x = from.x; x < bottomRight.x; x += cellSize.w) {
        if (this.getTileByPosition({ x, y: from.y })) return true;
      }
    } else if (position === Position.Left) {
      return this.isWallLeft();

      for (let y = topLeft.y; y < bottomLeft.y; y += cellSize.h) {
        if (this.getTileByPosition({ x: topLeft.x, y })) return true;
      }
    }

    return false;
  }

  hasWallFromTo(from: IPointData, to: IPointData): boolean {
    // const a = Point
    for (let y = from.y; y <= to.y; y++) {
      for (let x = from.x; x <= to.x; x++) {}
    }
    return false;
  }

  getLayer(layerName?: string): ITiledMapLayer | null {
    const { layers } = this;

    if (!layerName) return this.mainLayer || null;

    const [layer] = layers.filter(({ name }) => name === layerName);

    return layer || null;
  }

  getTileset(tilesetName?: string): ITileset | null {
    const { tilesets } = this;

    if (!tilesetName) return this.mainTileset || null;

    const [tileset] = tilesets.filter(({ name }) => name === tilesetName);

    return tileset || null;
  }

  getTile(
    x: IPointData | number,
    y?: number,
    layerName?: string
  ): ITile | null {
    const point = Point.valueOf(x, y);
    const layer = this.getLayer(layerName);

    return layer?.data[point.y][point.x] || null;
  }

  private load = async (mapFile: string) => {
    const { tilesets, layers } = await TiledMap.load(mapFile);

    layers.forEach(layer => {
      if (layer.name === this.mainLayerName) {
        // set main layer
        this.mainLayer = layer;
      }
    });
    tilesets.forEach(tileset => {
      const tilesetObj = new Tileset(tileset);

      if (!this.mainTilesetName) {
        this.mainTilesetName = tileset.name;
      }

      if (tileset.name === this.mainTilesetName) {
        // set main tileset
        this.mainTileset = tilesetObj;
      }

      this.tilesets.push(tilesetObj);
    });

    this.layers = layers;

    this.setSizeAfterLoad()
      .enable()
      .show();
  };

  private setSizeAfterLoad() {
    const layer = this.mainLayer;
    const tileset = this.mainTileset;

    if (layer && tileset) {
      this.setSize(
        layer.width * tileset.tilewidth,
        layer.height * tileset.tileheight
      );
    }

    console.log("setSizeAfterLoad", this.getBounds());

    // todo: remove this line
    this.add(this.testLabel.align(this, Position.CenterLeft));

    return this;
  }

  private isWallTop(): boolean {
    return false;
  }

  private isWallRight(): boolean {
    return false;
  }

  private isWallBottom(): boolean {
    return false;
  }

  private isWallLeft(): boolean {
    return false;
  }
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
