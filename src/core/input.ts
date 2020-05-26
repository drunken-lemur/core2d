export interface IInput {
  isKeyHold: (...keys: Key[]) => boolean;
  isKeyPressed: (...keys: Key[]) => boolean;
}

export enum Key {
  ArrowUp = "ArrowUp",
  ArrowRight = "ArrowRight",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  w = "w",
  s = "s",
  a = "a",
  d = "d",
  q = "q",
  e = "e",
  Escape = "Escape",
  Enter = "Enter",
  Space = " "
}

enum Events {
  KeyUp = "keyup",
  KeyDown = "keydown"
}

type Keys = Partial<Record<Key, boolean>>;

export class BaseInput {
  private readonly keys: Keys;
  private readonly lastKeys: Keys;

  constructor() {
    this.keys = {};
    this.lastKeys = {};

    document.addEventListener(
      Events.KeyUp,
      e => (this.keys[e.key as Key] = false)
    );
    document.addEventListener(
      Events.KeyDown,
      e => (this.keys[e.key as Key] = true)
    );
  }

  isKeyHold = (...keys: Key[]) => keys.map(key => this.keys[key]).some(Boolean);

  isKeyPressed = (...keys: Key[]) => {
    return keys
      .map(key => {
        // handle key press + release
        let isKeyPressed = this.keys[key];

        // allow press only when state was changed
        if (this.lastKeys[key] !== isKeyPressed) {
          this.lastKeys[key] = isKeyPressed;
          return isKeyPressed;
        } else {
          return false;
        }
      })
      .some(Boolean);
  };
}
