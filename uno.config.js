// uno.config.js
import { defineConfig } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    colors: {
      grey: {
        1: '#E9E9E9',
        2: '#4D4E4D',
        3: '#f7f7f7',
        4: '#f5f5f5'
      },
      gray: {
        1: '#4D4E4D',
        2: '#7a7a7a',
        4: '#d3d3d3',
        3: '#A6A7A6',
        5: '#e9e9e9',
        6: '#F4F4F4',
        7: 'rgba(33, 39, 42, 0.2)',
        black: '#212221',
        10: '#212121',
        11: '#E0E0E0',
        12: '#333',
        13: '#A0A0A0',
        14: '#666',
        15: '#000',
        16: '#7f8188',
        17: '#E8EDF0'
      },
      red: {
        1000: '#fe4a4a',
        primary: '#FE4A4A',
        1: '#FF1A1A',
        2: '#ff4d4f'
      },
      black: {
        50: '#212221',
        100: '#000'
      },
      botalab: {
        1: '#6C6463'
      },
      navy: {
        1: '#123250',
        2: '#718496',
        3: '#A0ADB9',
        4: '#D0D6DC',
        deep: '#04263F',
        6: '#063451'
      },
      green: {
        1000: '#06C755'
      },
      blue: {
        1000: '#38599F',
        1100: '#3491FF',
        1200: '#A0BCEB'
      },
      brown: {
        1: '#B59E88',
        2: '#D8C8B9'
      },
      zIndex: {
        1: 1
      },
      yellow: {
        1: '#FFEA9D'
      },
      event: {
        1: '#757575',
        2: '#BEB08F',
        3: '#A1A56A',
        4: '#6A81A5',
        5: '#9C6AA5'
      }
    },
    borderWidth: {
      1: '1px'
    },
    borderRadius: {
      3: '3px'
    },
    height: {
      '50px': '3.125rem',
      15: '60px'
    },
    fontWeight: {
      200: 200,
      250: 250,
      300: 300,
      350: 350,
      475: 475,
      550: 550,
      625: 625
    },
    fontFamily: {
      body: ['Monserrat', 'sans-serif']
    },
    padding: {
      '4/5': '18px'
    },
    breakpoints: {
      xs: '320px',
      sm: '768px',
      md: '992px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    width: {
      15: '60px'
    },
    lineHeight: {
      base: 'normal'
    }
  },
  shortcuts: {
    'h-screen': 'h-100vh h-100dvh',
    'min-h-screen': 'min-h-100vh min-h-100dvh',
    'max-h-screen': 'max-h-100vh max-h-100dvh'
  },
  transformers: [transformerVariantGroup(), transformerDirectives()]
})
