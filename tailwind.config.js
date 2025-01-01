/** @type {import('tailwindcss').Config} */
function rgbaToHex(r, g, b, a) {
  const alpha = a + (1 - a)
  const red = (r * a + 255 * (1 - a)) / alpha
  const green = (g * a + 255 * (1 - a)) / alpha
  const blue = (b * a + 255 * (1 - a)) / alpha

  return `rgb(${red},${green},${blue})`
}
export default {
  important: false,
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  screens: {
    sm: '640px',
    // => @media (min-width: 640px) { ... }
    md: '768px',
    // => @media (min-width: 768px) { ... }
    lg: '1024px',
    // => @media (min-width: 1024px) { ... }
    xl: '1200px',
    // => @media (min-width: 1200px) { ... }
    xxl: '1536px',
  },
  theme: {
    scale: {
      '100': '1',
      '150': '1.5',
      '200': '2',
    },
    extend: {
      colors: {
        primary: {
          0: '#0d0d0d',
          500: rgbaToHex(13,13,13, 0.5),
          900: rgbaToHex(13,13,13, 0.1),
        },
        secondary: {
          0: '#00db80',
          100: rgbaToHex(0,219,128,.9),
          500: rgbaToHex(0,219,128,.5),
          900: rgbaToHex(0,219,128,.1),
        },
        tertiary: {
          0: '#fecd44',
          500: rgbaToHex(254, 205, 68, 0.5),
          900: rgbaToHex(254, 205, 68, 0.1),
        },
        validation: {
          success: '#00AD90',
          error: '#DD614A',
        },
        'primary-admin':{
          0:  '#00B0F0',
          900: rgbaToHex(0,176,240,.1),
        },
        'secondary-admin': {
          0: '#00477a',
          100: rgbaToHex(0,71,122,.9),
          500: rgbaToHex(0,71,122,.5),
          900: rgbaToHex(0,71,122,.1),
        },
        'cards': {
          0: '#ECFCFA',
          100: '#f4ecfc',
          200: '#fcecf4',
          300: '#dbe6eb',
        },
        'dialog': {
          0: '#F5F5F5'
        }
      },
      borderColor: (theme) => ({
        ...theme('colors'),
      }),
      borderWidth: {
        1: '1px',
      },
      borderRadius:{
        '6.5xl': '3.25rem',
      },
      zIndex: {
        '1': '1',
      },
      spacing: {
        '160': '40rem',
      }
    },
  },
  plugins: [],
}
// #
