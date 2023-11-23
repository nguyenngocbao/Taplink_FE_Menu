import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        black: '#171717',
        blank: '#F7F7F7',
        body: '#262626',
        primary: '#1540C3',
        'primary-basic': '#354DE1',
        'primary-bg': '#F3F6FF',
        'primary-bg2': '#DCE4FF',
        secondary: '#E5A733',
        'secondary-bg': '#FFFAEF',
        warning: '#D93A3A',
        disabled: '#BDBDBD',
        neutra900: '#18181B'
      }
    }
  },
  plugins: []
};
export default config;
