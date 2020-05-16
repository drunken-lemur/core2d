export interface IVisible {
  show: () => this;
  hide: () => this;
  toggleView: () => this;
  isHidden: () => boolean;
  isVisible: () => boolean;
}
