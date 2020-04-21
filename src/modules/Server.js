import express from "express";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
// classes
import Module from "../abstracts/Module";
import Middleware from "../processors/Middleware";

export default class Server extends Module {
  $server;

  constructor(name, middlewares = [], config = {}, services = {}) {
    if (!config.port) {
      config.port = 3757;
    }
    if (!services.$logger) {
      services.$logger = console;
    }

    super(name, middlewares, config, services);

    this.processors.forEach((processor) => {
      if (!(processor instanceof Middleware)) {
        throw new Error("Invalid instance for middlware in server");
      }
    });
  }

  start = () => {
    this.$server = express();
    // gzip compression
    this.$server.use(compress());
    // lets you use HTTP verbs such as PUT or DELETE in places where the client
    // doesn't support it
    this.$server.use(methodOverride());
    // secure apps by setting various HTTP headers
    this.$server.use(helmet());
    // enable CORS - Cross Origin Resource Sharing
    this.$server.use(cors());
    // handle OPTION requests
    this.$server.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headelogrs",
        "X-Requested-With, content-type, Access-Control-Allow-Origin, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", true);
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.header("Pragma", "no-cache");
      return next();
    });
    // Parse request
    this.$server.use(bodyParser.json());

    // Custom middlewares
    this.processors.forEach((middleware) => {
      // dependency injection
      middleware.services = this.services;
      // add middleware
      const httpMethod = middleware.httpMethod;
      const route = middleware.route;

      switch (httpMethod.toLowerCase()) {
        case "get": {
          this.$server.get(route, middleware.process);
          break;
        }
        case "post": {
          this.$server.post(route, middleware.process);
          break;
        }
        default: {
          this.$server.use(route, middleware.process);
          break;
        }
      }
    });

    // start server
    this.$server.listen(this.config.port, () =>
      this.services.$logger.log(`Server listening to port ${this.config.port}`)
    );
  };
}
