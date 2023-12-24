import { createAcidicConfig } from "@acidic/config";
import { AcidicEngine } from "@acidic/engine";
import { StormError, getCauseFromUnknown } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import { isSetString } from "@storm-stack/utilities";
import { AcidicDaemonErrorCode } from "../errors";
import { MessageIdType } from "../types";

export const startDaemonProcess = async () => {
  const Config = createAcidicConfig();
  const Logger = StormLog.create(Config.storm, "Acidic Daemon");
  const Engine = AcidicEngine.create(Config, Logger);

  let name;
  let schemaPath;
  if (process.argv.length > 2) {
    isSetString(process.argv[2]) && (name = process.argv[2]);
    isSetString(process.argv[3]) && (schemaPath = process.argv[3]);
  }

  try {
    if (!name) {
      throw new StormError(AcidicDaemonErrorCode.missing_name, {
        message: "No name argument was provided to Acidic daemon process"
      });
    }
    if (!schemaPath) {
      throw new StormError(AcidicDaemonErrorCode.missing_schema, {
        message: "No schemaPath argument was provided to Acidic daemon process"
      });
    }

    process.send?.({
      type: "process:msg",
      data: {
        messageId: MessageIdType.LOADING,
        payload: {
          name
        }
      }
    });

    const schema = await Engine.execute({
      schema: schemaPath,
      packageManager: Config.packageManager,
      outputPath: Config.outputPath
    });

    process.send?.({
      type: "process:msg",
      data: {
        messageId: MessageIdType.ACTIVE,
        payload: {
          name,
          schema
        }
      }
    });
    process.send?.("ready");
  } catch (e) {
    process.send?.({
      type: "process:msg",
      data: {
        messageId: MessageIdType.ERROR,
        payload: {
          name,
          error: getCauseFromUnknown(e)
        }
      }
    });
    process.send?.("ready");
  }
};

startDaemonProcess();
