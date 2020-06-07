import { Color, Entity, IBoundsData, IBrushStyle, IView } from "core";

export class Label extends Entity {
  // todo: measure text
  text: string;

  style: IBrushStyle = { fillStyle: Color.Black, textBaseline: "top" };

  views: IView<Label>[] = [
    (label, brush) => {
      brush.fillText(label.text, label.x, label.y);
    }
  ];

  constructor(text: string = "", bounds?: IBoundsData) {
    super(bounds);

    this.text = text;
  }
}
