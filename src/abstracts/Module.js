import { randomString } from "../helpers";

export default class Module {
  name;
  services;
  config;
  processors;

  constructor(name, processors = [], config = {}, services = {}) {
    this.name = name || randomString(10);
    this.config = config;
    this.services = services;
    this.processors = processors;
  }

  start = () => {
    throw new Error("Method start not implemented in module");
  };
}
