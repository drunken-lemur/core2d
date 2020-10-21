import { bindMethods } from "lib/utils/bindMethods";

export class Dispatcher<T extends any = any> {
  private dispatched_ = false;

  private readonly owner: T;
  private events: Array<(owner: T) => void>;

  get dispatched() {
    return this.dispatched_;
  }

  constructor(owner: T, ...events: Array<(owner: T) => void>) {
    this.owner = owner;
    this.events = [...events];

    bindMethods(this, this.dispatch, this.addEvents);
  }

  dispatch() {
    this.dispatched_ = true;

    while (this.events.length) {
      const event = this.events.pop();
      event?.apply && event(this.owner);
    }
  }

  addEvents(...events: Array<(owner: T) => void>) {
    this.events = [...this.events, ...events];

    if (this.dispatched_) this.dispatch();
  }
}
