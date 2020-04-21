export default class Processor {
  trigger;
  services;

  constructor(trigger) {
    this.trigger = trigger;
  }

  process = () => {
    throw new Error("process method not implemented");
  };
}
