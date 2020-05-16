import { IGame, ISizeData, IScene, Scene, Size, Point } from "../../../core";

import { Mosaic, Square } from "../entities";

export class Greeting extends Scene implements IScene {
  constructor(game: IGame, size?: ISizeData) {
    super(game, size);

    // this.add(new Mosaic(this.size, Size.valueOf(50, 50)));

    const squareSize = Size.valueOf(50, 50);
    const a = new Square(squareSize).setPosition(Point.valueOf(50, 50));
    const b = new Square(squareSize).setPosition(Point.valueOf(100, 50));
    const c = new Square(squareSize).setPosition(Point.valueOf(50, 100));
    const d = new Square(squareSize).setPosition(Point.valueOf(100, 100));
    this.add(a, b, c, d);
  }
}
