export interface IKeyboardFn {
  (...keys: Key[]): boolean;
}

export interface IInput {
  isKeyHold: IKeyboardFn;
  isKeyPressed: IKeyboardFn;
}

export enum Key {
  ArrowUp = "ArrowUp",
  ArrowRight = "ArrowRight",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  KeyW = "KeyW",
  KeyS = "KeyS",
  KeyA = "KeyA",
  KeyD = "KeyD",
  KeyQ = "KeyQ",
  KeyE = "KeyE",
  KeyU = "KeyU",
  KeyH = "KeyH",
  KeyJ = "KeyJ",
  KeyK = "KeyK",
  Escape = "Escape",
  Enter = "Enter",
  Space = "Space",
  ControlLeft = "ControlLeft",
  ControlRight = "ControlRight",
  AltRight = "AltRight",
  AltLeft = "AltLeft",
  MetaLeft = "MetaLeft",
  MetaRight = "MetaRight"
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
      e => (this.keys[e.code as Key] = false)
    );
    document.addEventListener(
      Events.KeyDown,
      e => (this.keys[e.code as Key] = true)
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
