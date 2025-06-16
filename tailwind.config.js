/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // fontFamily: {
      //   goodHeadlineXcond: 'GoodHeadlineXcond, sans-serif',
      //   goodHeadlineMedium: 'GoodHeadlineMedium, sans-serif',
      //   goodHeadlineRegular: 'GoodHeadlineRegular, sans-serif',
      // },
      // fontSize: {
      //   '10xl': [
      //     '10rem',
      //     {
      //       lineHeight: '7rem',
      //     },
      //   ],
      //   enrollButton: [
      //     '0.875rem',
      //     {
      //       lineHeight: '2.75',
      //     },
      //   ],
      // },
      colors: {
        hpBlue: 'rgb(0, 150, 214)',
        lava: '#ef3200',
        lavaLight: '#ff5f33',
        lavaOpacity: 'rgba(239, 50, 0, 0.3)',
        navigationHoverActive: 'rgba(239, 50, 0, 0.05)',
        navigationHover: 'rgba(0, 0, 0, 0.03)',
        midnight: '#000110',
        indigo: '#002A4E',
        polyGray: '#d1d3d4',
        polyDarkerGray: '#666',
        backgroundGray: '#fafafa',
      },

      fontFamily: {
        'djr-forma': ['"DJR Forma Display"', '"Forma DJR Display Medium"',], // Add your custom font here
      },
      


      boxShadow: {
        image: '0 0 40px -10px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        // header: "url('/src/images/experthero.png')",
        // headset: "url('/src/images/headsethero.jpg')",
        // voice: "url('/src/images/voicehero.jpg')",
        // video: "url('/src/images/videohero.jpg')",
        // infrastructure: "url('/src/images/infrastructurehero.jpg')",
        // texture: "url('/src/images/propeller.png')",
      },
    },
  },
  plugins: [],
};
