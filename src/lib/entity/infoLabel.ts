import { Color, IBrushStyle } from "core";

import { Label } from "./label";

export class InfoLabel extends Label {
  private static instance: InfoLabel;
  style: IBrushStyle = {
    font: `${12}px Verdana`,
    textAlign: "center",
    textBaseline: "middle",
    fillStyle: Color.White,
    strokeStyle: Color.Black,
  };

  private constructor(text = "") {
    super(text);
  }

  static getInstance(text = "") {
    if (!InfoLabel.instance) InfoLabel.instance = new InfoLabel(text);

    if (text !== undefined) InfoLabel.instance.text = text;

    return InfoLabel.instance;
  }
}
