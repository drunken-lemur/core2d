// Main Game Class
enum Key {
  Up = 38,
  Right = 39,
  Down = 40,
  Left = 37,
  W = 87,
  S = 83,
  A = 65,
  D = 68,
  Q = 81,
  E = 69,
  Ecs = 27,
  Enter = 13
}

class Game {
  private activeScene: Scene;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly keys: Partial<Record<Key, boolean>>;
  private readonly lastKeyState: Partial<Record<Key, boolean>>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.keys = {};
    this.lastKeyState = {};

    this.initInput();
    this.activeScene = new IntroScene(this);
  }

  setScene = (scene: Scene) => {
    this.activeScene = scene;
  };

  initInput = () => {
    document.addEventListener("keydown", e => (this.keys[e.which] = true));
    document.addEventListener("keyup", e => (this.keys[e.which] = false));
  };

  start = () => {
    let dt = 0,
      step = 1 / 60,
      last = performance.now();

    const frame = now => {
      dt = dt + Math.min(1, (now - last) / 1000);
      while (dt > step) {
        dt = dt - step;
        this.update(step);
      }
      last = now;

      this.render(dt);
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  update = (dt: number) => {
    this.activeScene.update(dt);
  };

  render = (dt: number) => {
    this.ctx.save();
    this.activeScene.render(dt, this.ctx, this.canvas);
    this.ctx.restore();
  };

  wasKeys = (...keyCodes: Key[]) => {
    return keyCodes.map(this.wasKeyPressed).some(Boolean);
  };

  isKeys = (...keyCodes: Key[]) => {
    return keyCodes.map(this.isKeyPressed).some(Boolean);
  };

  private isKeyPressed = (keyCode: Key) => this.keys[keyCode];

  private wasKeyPressed = (keyCode: Key) => {
    // handle key press + release
    let isKeyPressed = this.keys[keyCode];

    // allow press only when state was changed
    if (this.lastKeyState[keyCode] !== isKeyPressed) {
      this.lastKeyState[keyCode] = isKeyPressed;
      return isKeyPressed;
    } else {
      return false;
    }
  };
}

abstract class Scene {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  abstract update(dt: number): void;

  abstract render(
    dt: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void;
}

class IntroScene extends Scene {
  private infoText: string;
  private elapsedTime: number;
  private readonly bigText: string;
  private readonly logoRevealTime: number;
  private readonly textTypingTime: number;
  private readonly sceneDisplayTime: number;

  constructor(game: Game) {
    super(game);

    this.logoRevealTime = 2;
    this.textTypingTime = 2;
    this.sceneDisplayTime = 6;

    this.elapsedTime = 0;
    this.bigText = "Intro";
    this.infoText = "This is intro scene example...";
  }

  update = (dt: number) => {
    this.elapsedTime += dt;

    // switch to next scene (by timer or if user want to skip it)
    if (
      this.elapsedTime >= this.sceneDisplayTime ||
      this.game.wasKeys(Key.Enter)
    ) {
      this.game.setScene(new MenuScene(this.game));
    }
  };

  render = (
    dt: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    // fill background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw big logo text
    ctx.globalAlpha = Math.min(1, this.elapsedTime / this.logoRevealTime);
    ctx.font = "80px Helvetica";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      this.bigText,
      (canvas.width - ctx.measureText(this.bigText).width) / 2,
      canvas.height / 2
    );

    // draw typing text
    if (this.elapsedTime >= this.logoRevealTime) {
      let textProgress = Math.min(
        1,
        (this.elapsedTime - this.logoRevealTime) / this.textTypingTime
      );
      ctx.font = "20px Helvetica";
      ctx.fillStyle = "#bbb";
      ctx.fillText(
        this.infoText.substr(
          0,
          Math.floor(this.infoText.length * textProgress)
        ),
        (canvas.width - ctx.measureText(this.infoText).width) / 2,
        canvas.height / 2 + 80
      );
    }
  };
}

class MenuScene extends Scene {
  private menuIndex: number;
  private menuItems: string[];
  private opacityDirection: number;
  private menuActiveOpacity: number;
  private readonly menuTitle: string;

  constructor(game: Game) {
    super(game);

    // set default values
    this.menuIndex = 0;
    this.opacityDirection = 1;
    this.menuActiveOpacity = 0;
    this.menuTitle = "Game Menu";
    this.menuItems = ["Start", "Intro", "Exit"];
  }

  update = (dt: number) => {
    // calculate active menu item opacity
    let opacityValue = this.menuActiveOpacity + dt * this.opacityDirection;
    if (opacityValue > 1 || opacityValue < 0) this.opacityDirection *= -1;
    this.menuActiveOpacity += dt * this.opacityDirection;

    // menu navigation
    if (this.game.wasKeys(Key.S, Key.Down)) {
      // DOWN arrow
      this.menuIndex++;
      this.menuIndex %= this.menuItems.length;
    } else if (this.game.wasKeys(Key.W, Key.Up)) {
      // UP arrow
      this.menuIndex--;
      if (this.menuIndex < 0) this.menuIndex = this.menuItems.length - 1;
    }

    // menu item selected
    if (this.game.wasKeys(Key.Enter)) {
      switch (this.menuIndex) {
        case 0:
          this.game.setScene(new GameScene(this.game));
          break;
        case 1:
          this.game.setScene(new IntroScene(this.game));
          break;
        case 2:
          this.game.setScene(new ExitScene(this.game));
          break;
      }
    }
  };

  render = (
    dt: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    // fill menu background
    ctx.fillStyle = "#007";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw menu title
    ctx.font = "60px Helvetica";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      this.menuTitle,
      (canvas.width - ctx.measureText(this.menuTitle).width) / 2,
      20
    );

    // draw menu items
    const itemHeight = 50,
      fontSize = 30;
    ctx.font = fontSize + "px Helvetica";
    for (const [index, item] of this.menuItems.entries()) {
      if (index === this.menuIndex) {
        ctx.globalAlpha = this.menuActiveOpacity;
        ctx.fillStyle = "#089cd3";
        ctx.fillRect(
          0,
          canvas.height / 2 + index * itemHeight,
          canvas.width,
          itemHeight
        );
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff";
      ctx.fillText(
        item,
        (canvas.width - ctx.measureText(item).width) / 2,
        canvas.height / 2 + index * itemHeight + (itemHeight - fontSize) / 2
      );
    }
  };
}

class GameScene extends Scene {
  private posX: number;
  private posY: number;
  private angle: number;

  constructor(game: Game) {
    super(game);

    this.posX = 0;
    this.posY = 0;
    this.angle = 0;
  }

  update = (dt: number) => {
    const { isKeys, wasKeys, setScene } = this.game;

    if (isKeys(Key.W, Key.Up)) this.posY--;
    if (isKeys(Key.S, Key.Down)) this.posY++;
    if (isKeys(Key.A, Key.Left)) this.posX--;
    if (isKeys(Key.D, Key.Right)) this.posX++;
    if (isKeys(Key.E)) this.angle++;
    if (isKeys(Key.Q)) this.angle--;
    if (wasKeys(Key.Ecs)) setScene(new MenuScene(this.game)); // Back to menu
  };

  render = (
    dt: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const rectSize = 150;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(this.posX, this.posY);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.translate(-rectSize / 2, -rectSize / 2);
    ctx.fillStyle = "#0d0";
    ctx.fillRect(0, 0, rectSize, rectSize);
  };
}

class ExitScene extends Scene {
  update = (dt: number) => void 0;

  render = (
    dt: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // display "game over" text
    const gameOverText = "Game Over";
    ctx.textBaseline = "top";
    ctx.font = "100px Helvetica";
    ctx.fillStyle = "#ee4024";
    ctx.fillText(
      gameOverText,
      (canvas.width - ctx.measureText(gameOverText).width) / 2,
      canvas.height / 2 - 50
    );
  };
}

// create canvas
const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 400;

// add canvas to document body
document.body.appendChild(canvas);

// launch game
const game = new Game(canvas);

game.start();
