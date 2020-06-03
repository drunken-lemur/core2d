import { IGame, IScreen, BaseApp, Resolutions, CanvasScreen } from "core";
import { BasicGame, Demo, SnakeGame, SpaceRockGame } from "game";

enum Game {
  BasicGame = "BasicGame",
  Demo = "Demo",
  Snake = "Snake",
  SpaceRock = "SpaceRock"
}

const games: Record<Game, (screen: IScreen) => IGame> = {
  BasicGame: screen => new BasicGame(screen),
  Demo: screen => new Demo(screen),
  Snake: screen => new SnakeGame(screen),
  SpaceRock: screen => new SpaceRockGame(screen)
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

    // setStyle(this.canvas, { border: "1px solid black" });

    document.body.appendChild(this.canvas);
  }

  run = (gameName: Game) => {
    const screen = new CanvasScreen(this.canvas, Resolutions.$8x5.$640x400);

    const game = games[gameName](screen);
    game.start();

    return this;
  };
}

setStyle(document.body, { margin: "0" });

new App().run(Game.Demo);
