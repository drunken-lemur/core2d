import { BaseGame, IBehavior } from "core";

import { Label } from "./label";

export class FpsLabel extends Label {
  replaceChar = "$";
  template: string = "FPS: $";

  behaviors: IBehavior<Label>[] = [
    label => {
      const { fps } = BaseGame.instance.timer;
      const { replaceChar, template } = this;

      label.text = template.replace(replaceChar, `${fps}`);
    }
  ];
}
