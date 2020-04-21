export default class MessageBroker {
  eventHandlers = {};
  $logger = console;
  config;

  constructor(config = {}) {
    this.config = config;
  }

  subscribe = (event, handler) => {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    if (!handler || typeof handler.process !== "function") {
      const err =
        "Invalid handler provided for event " + event + " : " + handler;
      this.$logger.error(err);
      throw new Error(err);
    }
    this.eventHandlers[event].push(handler);
    return true;
  };

  publish = (event, data) => {
    if (!this.eventHandlers[event]) {
      const error = "Failed to publish to event " + event + ": Event not found";
      this.$logger.error(error);
      return Promise.reject(error);
    }
    const handlers = this.eventHandlers[event];

    if (handlers.length <= 0) {
      this.$logger.warn("No handler found for event " + event);
      return Promise.resolve(false);
    }
    // try/catch to handle thrown errors so broker always return rejected promise
    try {
      // We will return the result of the first handler, the others will be deferred
      // in the first handler, we will let the caller handle the promise rejection
      const [firstHandler, ...rest] = handlers;
      const result = firstHandler.process(data);
      // Other handlers
      // we should handle rejections and error because the caller doesn't have access to the others
      rest.forEach((aHandler) => {
        try {
          const otherResult = aHandler.process(data);
          otherResult &&
            otherResult.catch &&
            otherResult.catch((e) => this.$logger.error(e));
        } catch (e) {
          this.$logger.error(e);
        }
      });
      return result && result.then ? result : Promise.resolve(result);
    } catch (e) {
      this.$logger.error(e);
      return Promise.reject(e);
    }
  };
}
