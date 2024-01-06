import { createAcidicConfig } from "@acidic/config";
import { AcidicEngine } from "@acidic/engine";
import { StormError } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import { StormParser } from "@storm-stack/serialization";
import { isSetString } from "@storm-stack/utilities";
import { AcidicDaemonErrorCode } from "../errors";
import { MessageIdType } from "../types";

export const startDaemonProcess = async () => {
  const Config = createAcidicConfig();
  const Logger = StormLog.create(Config.storm, "Acidic Daemon");
  const Engine = AcidicEngine.create(Config, Logger);

  let schemaPath;
  if (process.argv.length > 2) {
    isSetString(process.argv[2]) && (schemaPath = process.argv[2]);
  }

  try {
    if (!schemaPath) {
      throw new StormError(AcidicDaemonErrorCode.missing_schema, {
        message: "No schemaPath argument was provided to Acidic daemon process"
      });
    }

    process.send!({
      data: {
        messageId: MessageIdType.LOADING,
        payload: {
          path: schemaPath
        }
      }
    });

    const schema = await Engine.execute({
      schema: schemaPath,
      packageManager: Config.packageManager,
      outputPath: Config.outputPath
    });

    process.send!({
      data: {
        messageId: MessageIdType.ACTIVE,
        payload: {
          path: schemaPath,
          schema
        }
      }
    });
    process.send!("ready");
  } catch (e) {
    process.send?.({
      data: {
        messageId: MessageIdType.ERROR,
        payload: {
          path: schemaPath,
          error: StormParser.stringify(StormError.create(e))
        }
      }
    });
    process.send!("ready");
  }
};

startDaemonProcess();
