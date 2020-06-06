import { IGame } from "./game";
import { Entity, IEntity } from "./entity";
import { childrenView, rectView } from "./view";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  game: IGame;

  views = [rectView, childrenView];

  constructor(game: IGame) {
    super();

    this.game = game;

    this.setSize(game.screen);
  }
}
