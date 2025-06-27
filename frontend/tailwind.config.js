/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // wichtig für React!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Ensure all color combinations for common shades are included
    // You can adjust these patterns based on the colors and shades you actually use.
    // For example, if you only use 'red' and 'blue' and shades 600/700, you can be more specific.
    {
      pattern: /(bg|text|border)-(red|green|blue|indigo|yellow|purple)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus-visible'],
    },
    {
        pattern: /(bg|hover:bg)-(red|green|blue|indigo|yellow|purple)-(500|600|700)/,
    }
  ],
}