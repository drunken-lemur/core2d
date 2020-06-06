import { IBehavior } from "core";

import { Label } from "./label";
import { Score } from "../score";

export class ScoreLabel extends Label {
  replaceChar = "$";
  template: string = "Score: $";

  behaviors: IBehavior<Label>[] = [
    label => {
      const { template, replaceChar } = this;

      label.text = template.replace(replaceChar, `${Score.get()}`);
    }
  ];
}
