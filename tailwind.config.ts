import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <-- Add this line to enable class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        syncPurple:"#9B7EBD",
        syncPurpleLight:"#D4BEE4",
        syncSky:"#37AFE1",
        syncSkyLight:"#4CC9FE",
        syncOrange:"#FF9D3D",
        syncOrangeLight:"#FFBD73",
      }
    },

    keyframes: {
      shimmer: {
        '0%': { backgroundPosition: '-700px 0' },
        '100%': { backgroundPosition: '700px 0' },
      },
    },
    animation: {
      shimmer: 'shimmer 2s infinite linear',
    },
  },
  plugins: [],
};

export default config;
