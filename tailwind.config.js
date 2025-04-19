module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      '@layer utilities': {
        '.scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555'
          }
        }
      }

    },
  },
  plugins: [],
}