import { Box } from "lib/entity";
import { Bounds, Color, IBrushStyle } from "core";

export class TestBox extends Box {
  style: IBrushStyle = { fillStyle: Color.Green };

  constructor() {
    super(Bounds.valueOf(32, 32, 32, 32));
  }
}
