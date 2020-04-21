import Processor from "../abstracts/Processor";

export default class Middleware extends Processor {
  route;
  httpMethod;

  constructor(httpMethod, route) {
    if (!httpMethod) {
      throw new Error("Http request method not provided in middleware");
    }
    if (!route) {
      throw new Error("Route method not provided in middleware");
    }
    super([httpMethod, route]);
    this.httpMethod = httpMethod;
    this.route = route;
  }
}
