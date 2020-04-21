import { mapAsync } from "../helpers";
import Module from "./Module";

export default class Application {
  modules;
  constructor(modules = []) {
    this.modules = modules.map((module) => {
      if (!(module instanceof Module)) {
        throw new Error("Invalid instance of module provided");
      }
      return module;
    });
  }

  start = () => {
    throw new Error("Method start is not implemented in application");
  };
}
