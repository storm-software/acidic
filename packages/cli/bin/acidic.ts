#!/usr/bin/env node

import("../src/index.js").then(mod => {
  mod
    .createCLIAcidicProgram()
    .then(exitCode => {
      process.exitCode = exitCode;
    })
    .catch(error => {
      console.error(error);
      process.exitCode = 1;
    });
});
