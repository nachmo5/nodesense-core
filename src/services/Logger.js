export default class Logger {
  name;
  config;
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }

  warn = (...params) => {
    console.warn(
      new Date().toISOString(),
      `[${this.name}] <Warning>`,
      ...params
    );
  };
  error = (...params) => {
    console.error(
      new Date().toISOString(),
      `[${this.name}] <Error>`,
      ...params
    );
  };
  log = (...params) => {
    console.log(new Date().toISOString(), `[${this.name}] `, ...params);
  };
}
