import { Color, IBrushStyle } from "core";

import { Label } from "./label";

export class InfoLabel extends Label {
  style: IBrushStyle = {
    font: `Arial ${48}px`,
    textAlign: "left",
    textBaseline: "middle",
    fillStyle: Color.White
  };
}
