import { IGame, BaseScene, Bounds, Point, Size } from "core";

import { Box } from "../entities";

export class Intro extends BaseScene {
  constructor(game: IGame) {
    super(game);

    const side = 60;
    const step = 2;
    const size = Size.objectOf(side, side);
    const position = Point.objectOf(side, side);

    const box1 = new Box();
    const box2 = new Box();
    const box3 = new Box();
    const box4 = new Box();

    box1.setSize(size);
    box2.setSize(size.plus(size));
    box3.setSize(size.plus(size));
    box4.setSize(size.plus(size));

    this.add(box1.add(box2.add(box3.add(box4))));

    // this.add(new Mosaic(this.size, Size.valueOf(50, 50)));

    // const squareSize = Size.valueOf(50, 50);
    // const a = new Square(squareSize).setPosition(Point.valueOf(50, 50));
    // const b = new Square(squareSize).setPosition(Point.valueOf(100, 50));
    // const c = new Square(squareSize).setPosition(Point.valueOf(50, 100));
    // const d = new Square(squareSize).setPosition(Point.valueOf(100, 100));
    // this.add(a, b, c, d);
  }
}
