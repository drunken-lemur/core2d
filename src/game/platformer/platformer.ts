import { BaseGame, IScene, IScreen, Color } from "core";
import { GameScene } from "./scene";

export class Platformer extends BaseGame {
  scene: IScene = new GameScene(this);

  constructor(screen: IScreen, fps: number = 60) {
    super(screen, fps);

    this.setStyle();
  }

  private setStyle = () => {
    const style = document.createElement("style");
    document.head.appendChild(style);

    style.innerText = `
      body {
        background: ${Color.Black};
      }
      
      canvas {
        top: 50%;
        left: 50%;
        position: absolute;
        border: 1px solid ${Color.White};
        transform: translate(-50%, -50%);
      }
    `;
  };
}
