export interface Livable {
  hp: number;
  maxHp: number;
  lives: number;
  isAlive: boolean;
  hit: (hp: number) => this;
  heal: (hp: number) => this;
  gainLife: (lives?: number) => this;
}
