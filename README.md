```
import Application from "nodesense-core";
import { Microservice, Server } from "nodesense-core/modules";
import { Handler, Middleware } from "nodesense-core/processors";


class FetchUsersMiddleware extends Middleware {
  process = async (req, res, next) => {
    const result = await this.services.$broker.publish("user.fetch.many");
    res.json(result);
  };
}

class FetchUsersHandler extends Handler {
  process = async () => {
    return [
      { email: "user1@example.com", name: "John Doe" },
      { email: "user2@example.com", name: "Jane Doe" },
    ];
  };
}

const $broker = new MessageBroker();

const server = new Server(
  "Api Gateway",
  [new FetchUsersMiddleware("get", "/users")],
  { port: 3131 },
  { $broker }
);

const userMicroservice = new Microservice(
  "User",
  [new FetchUsersHandler("user.fetch.many")],
  {},
  { $broker }
);
new Application([server, userMicroservice]).start();

```
