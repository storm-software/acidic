{ pkgs, inputs, ... }:
{
  name = "storm-software/acidic";

  dotenv.enable = true;
  dotenv.filename = [".env" ".env.local"];
  dotenv.disableHint = true;

  # https://devenv.sh/basics/
  env.DEFAULT_LOCALE = "en_US";
  env.DEFAULT_TIMEZONE = "America/New_York";

 # https://devenv.sh/packages/
  packages = [
    pkgs.pest-ide-tools
  ];

  # https://devenv.sh/languages/
  languages.rust = {
    enable = true;
    mold.enable = false;
    toolchainFile = ./rust-toolchain.toml;
  };
}

