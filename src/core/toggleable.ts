export interface IToggleable {
  isEnabled: () => boolean;
  isDisabled: () => boolean;

  toggle: () => this;
  enable: () => this;
  disable: () => this;
}
