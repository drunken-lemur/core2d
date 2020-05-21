import {
  BaseGame,
  BaseInput,
  BaseScene,
  Color,
  IDrawer,
  IGame,
  IInput,
  IScene,
  IScreen,
  Key
} from "core";
import { Delay, IDelay } from "core/delay";

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
    this.delay.update(dt);

    if (this.delay.isDone || this.game.input.isKeyPressedOnce(Key.Enter)) {
      this.game.scene = new MenuScene(this.game);
    }

    return this;
  }

  draw(d: IDrawer, dt: number) {
    // fill background
    d.fillStyle = Color.White;
    d.fillRect(0, 0, this.w, this.h);

    // draw big logo text
    d.globalAlpha = Math.min(1, this.elapsedTime / this.logoRevealTime);
    d.font = "80px Helvetica";
    d.fillStyle = Color.Black;

    d.fillText(
      this.bigText,
      (this.w - d.measureText(this.bigText).width) / 2,
      this.h / 2
    );

    // draw typing text
    if (this.elapsedTime >= this.logoRevealTime) {
      let textProgress = Math.min(
        1,
        (this.elapsedTime - this.logoRevealTime) / this.textTypingTime
      );
      d.font = "20px Helvetica";
      d.fillStyle = "#bbb";
      d.fillText(
        this.infoText.substr(
          0,
          Math.floor(this.infoText.length * textProgress)
        ),
        (this.w - d.measureText(this.infoText).width) / 2,
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
    if (this.game.input.isKeyPressedOnce(Key.s, Key.ArrowDown)) {
      // DOWN arrow
      this.menuIndex++;
      this.menuIndex %= this.menuItems.length;
    } else if (this.game.input.isKeyPressedOnce(Key.w, Key.ArrowUp)) {
      // UP arrow
      this.menuIndex--;
      if (this.menuIndex < 0) this.menuIndex = this.menuItems.length - 1;
    }

    // menu item selected
    if (this.game.input.isKeyPressedOnce(Key.Enter)) {
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

  draw(d: IDrawer, dt: number) {
    // fill menu background
    d.fillStyle = "#007";
    d.fillRect(0, 0, this.w, this.h);

    // draw menu title
    d.font = "60px Helvetica";
    d.textBaseline = "top";
    d.fillStyle = Color.White;
    d.fillText(
      this.menuTitle,
      (this.w - d.measureText(this.menuTitle).width) / 2,
      20
    );

    // draw menu items
    const itemHeight = 50;
    const fontSize = 30;

    d.font = fontSize + "px Helvetica";
    this.menuItems.forEach((item, index) => {
      if (index === this.menuIndex) {
        d.globalAlpha = this.menuActiveOpacity;
        d.fillStyle = "#089cd3";
        d.fillRect(0, this.h / 2 + index * itemHeight, this.w, itemHeight);
      }

      d.globalAlpha = 1;
      d.fillStyle = Color.White;
      d.fillText(
        item,
        (this.w - d.measureText(item).width) / 2,
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
    if (this.game.input.isKeyPressed(Key.w, Key.ArrowUp)) {
      this.posY--;
    }
    if (this.game.input.isKeyPressed(Key.s, Key.ArrowDown)) {
      this.posY++;
    }
    if (this.game.input.isKeyPressed(Key.a, Key.ArrowLeft)) {
      this.posX--;
    }
    if (this.game.input.isKeyPressed(Key.d, Key.ArrowRight)) {
      this.posX++;
    }
    if (this.game.input.isKeyPressed(Key.e)) {
      this.angle++;
    }
    if (this.game.input.isKeyPressed(Key.q)) {
      this.angle--;
    }

    if (this.game.input.isKeyPressedOnce(Key.Escape)) {
      this.game.scene = new MenuScene(this.game);
    }

    return this;
  }

  draw(d: IDrawer, dt: number) {
    const rectSize = 150;

    d.save();
    d.clearRect(0, 0, this.w, this.h);
    d.translate(this.posX, this.posY);
    d.rotate((this.angle * Math.PI) / 180);
    d.translate(-rectSize / 2, -rectSize / 2);
    d.fillStyle = "#0d0";
    d.fillRect(0, 0, rectSize, rectSize);
    d.restore();

    return this;
  }
}

class ExitScene extends BaseScene {
  constructor(game: IGame) {
    super(game);

    this.setSize(game.screen);
  }

  update(dt: number) {
    if (this.game.input.isKeyPressedOnce(Key.Escape)) {
      this.game.scene = new IntroScene(this.game);
    }

    return this;
  }

  draw(d: IDrawer, dt: number) {
    // clear the canvas
    d.clearRect(0, 0, this.w, this.h);

    // display "game over" text
    const gameOverText = "Game Over";
    d.textBaseline = "top";
    d.font = "100px Helvetica";
    d.fillStyle = "#ee4024";
    d.fillText(
      gameOverText,
      (this.w - d.measureText(gameOverText).width) / 2,
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
