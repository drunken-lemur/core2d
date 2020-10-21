import { defaultView, Entity, IBrushStyle, IViews } from "core";

export class Map extends Entity {
  style: IBrushStyle = {};

  views: IViews<this> = [defaultView];

  constructor() {
    super();
  }
}
