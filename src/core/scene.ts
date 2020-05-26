import { IGame } from "./game";
import { RectView } from "./view";
import { IEntity, Entity } from "./entity";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  game: IGame;

  constructor(game: IGame) {
    super();

    this.game = game;
    this.setSize(game.screen).setView(new RectView(this));
  }
}
