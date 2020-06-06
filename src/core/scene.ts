import { IGame } from "./game";
import { RectView } from "./view";
import { Entity, IEntity } from "./entity";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  game: IGame;

  views = [new RectView(this)];

  constructor(game: IGame) {
    super();

    this.game = game;

    this.setSize(game.screen);
  }
}
