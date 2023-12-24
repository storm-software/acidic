import { create } from "@storybook/theming";

const theme: any = create({
  base: "dark",

  colorPrimary: "#1fb2a6",
  colorSecondary: "#4c6ef5",

  // UI
  appBg: "#18181B",
  appContentBg: "#18181B",
  appBorderColor: "#2a323c",
  appBorderRadius: 2,

  // Text colors
  textColor: "#1fb2a6",
  textInverseColor: "#4c6ef5",

  // Toolbar default and active colors
  barTextColor: "#1fb2a6",
  barSelectedColor: "#4c6ef5",
  barBg: "#2a323c",

  // Form colors
  inputBg: "#2D3348",
  inputBorder: "#8B949E",
  inputTextColor: "#8B949E",
  inputBorderRadius: 2,

  brandTitle: "Acidic",
  brandUrl: "https://acidic.io",
  brandImage: require("../../assets/logos/logo.png")
});

export default theme;
