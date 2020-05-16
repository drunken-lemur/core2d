import { Demo } from "games";
import { BaseApp, CanvasScreen, Size, IGame, Second, IScreen } from "core";

enum Game {
  Demo = "Demo"
}

const screenSize = Size.valueOf(300, 200);

const games: Record<Game, (screen: IScreen) => IGame> = {
  Demo: screen => new Demo(screen)
};

type Style = Partial<CSSStyleDeclaration>;

const setStyle = (el: HTMLElement, style: Style) => {
  Object.assign<Style, Style>(el.style, style);
};

class App extends BaseApp {
  private readonly canvas: HTMLCanvasElement;

  constructor() {
    super();

    this.canvas = document.createElement("canvas");

    setStyle(this.canvas, { border: "1px solid black" });

    document.body.appendChild(this.canvas);
  }

  run = (gameName: Game) => {
    const screen = new CanvasScreen(this.canvas, screenSize);

    const game = games[gameName](screen);
    game.start();

    setTimeout(game.stop, 45 * Second);

    return this;
  };
}

setStyle(document.body, { margin: "0" });

new App().run(Game.Demo);
