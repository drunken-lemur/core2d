import { IGame, BaseScene, Point, Size } from "core";

import { Box } from "../entities";

export class Intro extends BaseScene {
  constructor(game: IGame) {
    super(game);

    const side = 60;
    const size = new Size(side);
    const position = new Point(side / 2);

    const box1 = new Box();
    const box2 = new Box();
    const box3 = new Box();
    const box4 = new Box();

    box1.setSize(new Size(4).multiply(size));
    // .setPosition(new Point(1).multiply(position));
    box2.setSize(new Size(3).multiply(size));
    // .setPosition(new Point(2).multiply(position));
    box3.setSize(new Size(2).multiply(size));
    // .setPosition(new Point(3).multiply(position));
    box4.setSize(new Size(1).multiply(size));
    // .setPosition(new Point(4).multiply(position));

    this.add(box1.add(box2.add(box3.add(box4))));

    box1.plusPosition(position);
    box2.plusPosition(position);
    box3.plusPosition(position);
    box4.plusPosition(position);

    // this.add(new Mosaic(this.size, Size.valueOf(50, 50)));

    // const squareSize = Size.valueOf(50, 50);
    // const a = new Square(squareSize).setPosition(Point.valueOf(50, 50));
    // const b = new Square(squareSize).setPosition(Point.valueOf(100, 50));
    // const c = new Square(squareSize).setPosition(Point.valueOf(50, 100));
    // const d = new Square(squareSize).setPosition(Point.valueOf(100, 100));
    // this.add(a, b, c, d);
  }
}
