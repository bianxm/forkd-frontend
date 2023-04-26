/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    // require('@tailwindcss/forms'),
    plugin(function({ addVariant }){
      addVariant('contentEditable','&[contentEditable="true"]')
    })
  ],
}

