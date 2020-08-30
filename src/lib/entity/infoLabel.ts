import { Color, IBrushStyle } from "core";

import { Label } from "./label";

export class InfoLabel extends Label {
  style: IBrushStyle = {
    font: `${24}px Verdana`,
    textAlign: "left",
    textBaseline: "middle",
    fillStyle: Color.Green
  };
}
