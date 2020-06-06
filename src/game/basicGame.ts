import {
  BaseGame,
  BaseInput,
  BaseScene,
  Color,
  Delay,
  IBrush,
  IDelay,
  IGame,
  IInput,
  IScene,
  IScreen,
  Key
} from "core";

class IntroScene extends BaseScene {
  private infoText: string;
  private elapsedTime: number;
  private readonly delay: IDelay;
  private readonly bigText: string;
  private readonly logoRevealTime: number;
  private readonly textTypingTime: number;
  private readonly sceneDisplayTime: number;

  constructor(game: IGame) {
    super(game);

    this.setSize(game.screen);

    this.logoRevealTime = 2;
    this.textTypingTime = 2;
    this.sceneDisplayTime = 6;

    this.elapsedTime = 0;
    this.bigText = "Intro";
    this.infoText = "This is intro scene example...";

    this.delay = new Delay(this.sceneDisplayTime);
  }

  update(dt: number) {
    this.elapsedTime += dt;

    if (
      this.delay.update(dt).isDone ||
      this.game.input.isKeyPressed(Key.Enter)
    ) {
      this.game.scene = new MenuScene(this.game);
    }

    return super.update(dt);
  }

  draw(b: IBrush, dt: number) {
    const alpha = Math.min(1, this.elapsedTime / this.logoRevealTime);

    // fill background
    b.setStyle({ fillStyle: Color.White })
      .fillRect(0, 0, this.w, this.h)

      // draw big logo text
      .setStyle({
        globalAlpha: alpha,
        font: "80px Helvetica",
        fillStyle: Color.Black
      })

      .fillText(
        this.bigText,
        (this.w - b.measureText(this.bigText).width) / 2,
        this.h / 2
      );

    // draw typing text
    if (this.elapsedTime >= this.logoRevealTime) {
      let textProgress = Math.min(
        1,
        (this.elapsedTime - this.logoRevealTime) / this.textTypingTime
      );

      b.setStyle({
        fillStyle: "#bbb",
        font: "20px Helvetica"
      }).fillText(
        this.infoText.substr(
          0,
          Math.floor(this.infoText.length * textProgress)
        ),
        (this.w - b.measureText(this.infoText).width) / 2,
        this.h / 2 + 80
      );
    }

    return this;
  }
}

class MenuScene extends BaseScene {
  private menuIndex: number;
  private menuItems: string[];
  private opacityDirection: number;
  private menuActiveOpacity: number;
  private readonly menuTitle: string;

  constructor(game: IGame) {
    super(game);

    this.setSize(game.screen);

    this.menuIndex = 0;
    this.opacityDirection = 1;
    this.menuActiveOpacity = 0;
    this.menuTitle = "Game Menu";
    this.menuItems = ["Start", "Intro", "Exit"];
  }

  update(dt: number) {
    // calculate active menu item opacity
    let opacityValue = this.menuActiveOpacity + dt * this.opacityDirection;
    if (opacityValue > 1 || opacityValue < 0) this.opacityDirection *= -1;
    this.menuActiveOpacity += dt * this.opacityDirection;

    // menu navigation
    if (this.game.input.isKeyPressed(Key.s, Key.ArrowDown)) {
      // Down arrow
      this.menuIndex++;
      this.menuIndex %= this.menuItems.length;
    } else if (this.game.input.isKeyPressed(Key.w, Key.ArrowUp)) {
      // Up arrow
      this.menuIndex--;
      if (this.menuIndex < 0) this.menuIndex = this.menuItems.length - 1;
    }

    // menu item selected
    if (this.game.input.isKeyPressed(Key.Enter)) {
      switch (this.menuIndex) {
        case 0:
          this.game.scene = new GameScene(this.game);
          break;
        case 1:
          this.game.scene = new IntroScene(this.game);
          break;
        case 2:
          this.game.scene = new ExitScene(this.game);
          break;
      }
    }

    return this;
  }

  draw(b: IBrush, dt: number) {
    // fill menu background
    b.setStyle({ fillStyle: "#007" })
      .fillRect(0, 0, this.w, this.h)

      // draw menu title
      .setStyle({
        textBaseline: "top",
        font: "60px Helvetica",
        fillStyle: Color.White
      })
      .fillText(
        this.menuTitle,
        (this.w - b.measureText(this.menuTitle).width) / 2,
        20
      );

    // draw menu items
    const fontSize = 30;
    const itemHeight = 50;

    b.setStyle({ font: fontSize + "px Helvetica" });
    this.menuItems.forEach((item, index) => {
      if (index === this.menuIndex) {
        b.setStyle({
          fillStyle: "#089cd3",
          globalAlpha: this.menuActiveOpacity
        }).fillRect(0, this.h / 2 + index * itemHeight, this.w, itemHeight);
      }

      b.setStyle({
        globalAlpha: 1,
        fillStyle: Color.White
      }).fillText(
        item,
        (this.w - b.measureText(item).width) / 2,
        this.h / 2 + index * itemHeight + (itemHeight - fontSize) / 2
      );
    });

    return this;
  }
}

class GameScene extends BaseScene {
  private posX: number;
  private posY: number;
  private angle: number;

  constructor(game: IGame) {
    super(game);

    this.setSize(game.screen);

    this.posX = this.w / 2;
    this.posY = this.h / 2;
    this.angle = 0;
  }

  update(dt: number) {
    if (this.game.input.isKeyHold(Key.w, Key.ArrowUp)) {
      this.posY--;
    }
    if (this.game.input.isKeyHold(Key.s, Key.ArrowDown)) {
      this.posY++;
    }
    if (this.game.input.isKeyHold(Key.a, Key.ArrowLeft)) {
      this.posX--;
    }
    if (this.game.input.isKeyHold(Key.d, Key.ArrowRight)) {
      this.posX++;
    }
    if (this.game.input.isKeyHold(Key.e)) {
      this.angle++;
    }
    if (this.game.input.isKeyHold(Key.q)) {
      this.angle--;
    }

    if (this.game.input.isKeyPressed(Key.Escape)) {
      this.game.scene = new MenuScene(this.game);
    }

    return this;
  }

  draw(b: IBrush, dt: number) {
    const rectSize = 150;

    b.save()
      .clearRect(0, 0, this.w, this.h)
      .translate(this.posX, this.posY)
      .rotate((this.angle * Math.PI) / 180)
      .translate(-rectSize / 2, -rectSize / 2)
      .setStyle({ fillStyle: "#0d0" })
      .fillRect(0, 0, rectSize, rectSize)
      .restore();

    return this;
  }
}

class ExitScene extends BaseScene {
  constructor(game: IGame) {
    super(game);

    this.setSize(game.screen);
  }

  update(dt: number) {
    if (this.game.input.isKeyPressed(Key.Escape)) {
      this.game.scene = new IntroScene(this.game);
    }

    return this;
  }

  draw(b: IBrush, dt: number) {
    const gameOverText = "Game Over";

    // clear the canvas
    b.clearRect(0, 0, this.w, this.h)

      // display "game over" text
      .setStyle({
        textBaseline: "top",
        fillStyle: "#ee4024",
        font: "100px Helvetica"
      })
      .fillText(
        gameOverText,
        (this.w - b.measureText(gameOverText).width) / 2,
        this.h / 2 - 50
      );

    return this;
  }
}

export class BasicGame extends BaseGame {
  input: IInput;
  scene: IScene;

  constructor(screen: IScreen) {
    super(screen, 60);

    this.input = new BaseInput();
    this.scene = new IntroScene(this);
  }
}
