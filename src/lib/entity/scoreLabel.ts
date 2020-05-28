import { IBoundsData } from "core";

import { Label } from "./label";
import { Score } from "../score";

export class ScoreLabel extends Label {
  replaceChar = "$";
  template: string = "Score: $";

  constructor(template: string = "Score: $", bounds?: IBoundsData) {
    super("", bounds);

    this.template = template;

    this.update(0);
  }

  update(deltaTime: number): this {
    this.text = this.template.replace(this.replaceChar, `${Score.get()}`);

    return super.update(deltaTime);
  }
}
