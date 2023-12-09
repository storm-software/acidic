import { joinPaths } from "@storm-stack/file-system";
import {
  connect,
  disconnect,
  launchBus,
  list,
  restart,
  start,
  type Proc
} from "pm2";

export const createWatcherProcess = (modelPath: string) => {
  launchBus((err: Error, pm2_bus) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2_bus.on("process:msg", (packet: any) => {
      console.log(packet);
    });
  });

  connect((connectError: Error) => {
    if (connectError) {
      console.error(connectError);
      process.exit(2);
    }

    start(
      {
        script: joinPaths(__dirname, "process.js"),
        name: modelPath.replaceAll(/\\/g, "-").replaceAll("/", "-"),
        watch: [modelPath]
      },
      (startError: Error, apps: Proc) => {
        if (startError) {
          console.error(startError);

          return disconnect();
        }

        list((err, list) => {
          console.log(err, list);

          restart("api", (err, proc) => {
            // Disconnects from PM2
            disconnect();
          });
        });
      }
    );
  });
};
