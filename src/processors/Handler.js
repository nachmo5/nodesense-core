import Processor from "../abstracts/Processor";

export default class Handler extends Processor {
  event;
  constructor(event) {
    if (!event) throw new Error("Event not provided for handler");
    super(event);
    this.event = this.trigger;
  }
}
