import { BaseBehavior, Delay, Entity, IDelay } from "core";

import { Label } from "./label";

export class TypingLabelBehavior extends BaseBehavior<Label> {
  private delay: IDelay;
  private originalText: string;

  constructor(
    label: Label,
    typingSec: number = 1,
    delaySec = 0,
    onDone?: () => void
  ) {
    super(label);

    this.delay = new Delay(typingSec, onDone, delaySec);
    this.originalText = label.text;
  }

  update(dt: number) {
    const { delay, originalText, parent } = this;

    delay.update(dt);

    if (delay.isStart) {
      parent.show().text = originalText.substr(
        0,
        Math.floor(originalText.length * delay.factor)
      );
    } else {
      parent.hide();
    }

    return super.update(dt);
  }
}

// todo: remove hardcoded
const fontSize = 20;
const maxStrLen = 70;

export class TypingLabel extends Entity {
  style = { font: `${fontSize}px Georgia` }; // todo: remove hardcoded

  constructor(
    text: string,
    typingSec: number = 1,
    delaySec = 0,
    onDone?: () => void // todo add Delay to finish time all labels
  ) {
    super();

    text
      .split(" ")
      .reduce(
        (acc, str) => {
          if (acc[acc.length - 1].length + str.length >= maxStrLen) {
            acc.push("");
          }

          acc[acc.length - 1] += " " + str;

          if (acc[acc.length - 1].length < maxStrLen) {
            acc[acc.length - 1] += [];
          }

          return acc;
        },
        [""]
      )
      .forEach((str, key) => {
        const label = new Label(str);
        const behavior = new TypingLabelBehavior(
          label,
          typingSec,
          delaySec + typingSec * key
        );
        this.add(
          label
            .setPosition(0, fontSize * key + fontSize)
            .setStyle(this.style)
            .addBehaviors(behavior)
        );
      });
  }
}
