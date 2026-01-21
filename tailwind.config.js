export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00ffff"
      },
      screens: {
        'xs': '475px',
        // Default screens already exist: sm:640, md:768, lg:1024, xl:1280, 2xl:1536
      },
    }
  },
  plugins: []
}
