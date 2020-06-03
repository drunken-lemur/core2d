import { IGame } from "./game";
import { Color } from "./color";
import { RectView } from "./view";
import { IEntity, Entity } from "./entity";

export interface IScene extends IEntity {
  game: IGame;
}

export class BaseScene extends Entity implements IScene {
  game: IGame;

  view = new RectView(this);

  style = { fillStyle: Color.White };

  constructor(game: IGame) {
    super();

    this.game = game;

    this.setSize(game.screen);
  }
}
