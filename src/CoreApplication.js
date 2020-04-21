import Application from "./abstracts/Application";
import { mapAsync } from "./helpers";

export default class CoreApplication extends Application {
  start = () =>
    mapAsync(this.modules, async (module) => {
      await module.start();
      console.log("Module " + module.name + " has started");
    })
      .then(() =>
        console.log(`
    __    _  _______  ______   _______  _______  _______  __    _  _______  _______ 
    |  |  | ||       ||      | |       ||       ||       ||  |  | ||       ||       |
    |   |_| ||   _   ||  _    ||    ___||  _____||    ___||   |_| ||  _____||    ___|
    |       ||  | |  || | |   ||   |___ | |_____ |   |___ |       || |_____ |   |___ 
    |  _    ||  |_|  || |_|   ||    ___||_____  ||    ___||  _    ||_____  ||    ___|
    | | |   ||       ||       ||   |___  _____| ||   |___ | | |   | _____| ||   |___ 
    |_|  |__||_______||______| |_______||_______||_______||_|  |__||_______||_______|
    
    `)
      )
      .catch(console.log);
}
