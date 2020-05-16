import { IGame } from "./game";
import { IDrawer } from "./drawer";
import { IEntity, Entity } from "./entity";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IEntity {
  game: IGame;

  constructor(game: IGame) {
    super();

    this.game = game;

    this.setSize(game.screen.getSize());
  }

  draw(drawer: IDrawer, deltaTime: number) {
    this.game.screen.fill();

    super.draw(drawer, deltaTime);

    return this;
  }
}
