/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-purple": "#7C5DFA",
        "custom-light-purple": "#9277FF",
        "custom-dark-blue": "#1E2139",
        "custom-darker-blue": "#252945",
        "custom-light-grey": "#DFE3FA",
        "custom-medium-grey": "#888EB0",
        "custom-blue-grey": "#7E88C3",
        "custom-black": "#0C0E16",
        "custom-red": "#EC5757",
        "custom-lighter-purple": "#9277FF",
        "custom-white": "#F8F8FB",
        "custom-darkest": "#141625",
      },
    },
  },
  plugins: [],
};
