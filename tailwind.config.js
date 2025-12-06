/* -------------------------------------------------------------------

                       ⚡ Storm Software - Acidic

 This code was released as part of the Acidic project. Acidic
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/acidic.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/acidic
 Documentation:            https://docs.stormsoftware.com/projects/acidic
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      "{packages,apps}/**/{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      fontFamily: {
        "mona-sans": ["Mona-Sans-ExtraBold", "sans-serif"],
        "mona-sans-light": ["Mona-Sans-Light", "sans-serif"],
        "antique-olive": ["Antique-Olive-Black", "sans-serif"]
      },
      backgroundImage: {
        "bg-noise": "url('/assets/images/bg-noise.webp')"
      },
      animation: {
        "fade-in": "fade-in .5s ease-out both",
        "fade-out": "fade-out .5s ease-out both"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        }
      }
    }
  },
  plugins: []
};
