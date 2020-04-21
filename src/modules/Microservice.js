import Module from "../abstracts/Module";
import Handler from "../processors/Handler";

export default class Microservice extends Module {
  constructor(name, handlers = [], config = {}, services = {}) {
    if (!services.$broker) {
      throw new Error("Missing broker dependency in microservice");
    }
    if (!services.$logger) {
      services.$logger = console;
    }
    super(name, handlers, config, services);

    this.processors.forEach((processor) => {
      if (!(processor instanceof Handler)) {
        throw new Error("Invalid instance for middlware in server");
      }
    });
  }

  start = () => {
    const $broker = this.services.$broker;

    this.processors.forEach((handler) => {
      // Dependency Injection
      handler.services = this.services;
      $broker.subscribe(handler.event, handler);
    });
  };
}
