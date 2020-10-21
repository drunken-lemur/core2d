import {
  Bounds,
  Color,
  Entity,
  IBrush,
  IBrushStyle,
  IViews,
  Size,
  styledView,
  translatedView
} from "core";

const mapData =
  "#########......." +
  "#..............." +
  "#.......########" +
  "#..............#" +
  "#......##......#" +
  "#......##......#" +
  "#..............#" +
  "###............#" +
  "##.............#" +
  "#......####..###" +
  "#......#.......#" +
  "#......#.......#" +
  "#..............#" +
  "#......#########" +
  "#..............#" +
  "################";

export class Map extends Entity {
  private static readonly Wall = "#";
  private static readonly Width = 16;
  private static readonly Height = 16;
  private static readonly CellSize = Size.valueOf(30);

  style: IBrushStyle = { fillStyle: Color.Red, strokeStyle: Color.Black };
  views: IViews<this> = [
    styledView,
    translatedView,
    (map, brush) => {
      const {
        Wall,
        Width,
        Height,
        CellSize: { w, h }
      } = Map;
      const { data } = map;

      for (let y = 0; y < Height; y++) {
        for (let x = 0; x < Width; x++) {
          const offset = y * Width + x;

          if (data[offset] === Wall) {
            brush.fillRect(x * w, y * w, w, h).strokeRect(x * w, y * w, w, h);
          }
        }
      }
    }
  ];
  private data: string;

  constructor(data: string = mapData) {
    super();

    this.data = data;
  }

  private static Draw(map: Map, brush: IBrush) {}
}
