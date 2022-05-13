module.exports = {
  content: [
      './*.html',
      './html_views/*.html',
      './node_modules/flowbite/**/*.js'
  ],
  theme: {
      extend: { },
      colors: {
          /** Primary **/
          // These are the splashes of color that should appear the most in your UI,
          // and are the ones that determine the overall "look" of the site.
          // Use these for things like primary actions,
          // links, navigation items, icons, accent borders, or text you want to emphasize.
          primary: {
            50: '#E9F6FE',
            100: '#C2E2FC',
            200: '#8CC2F5',
            300: '#8CC2F5',
            400: '#4284E4',
            500: '#4284E4',
            600: '#2251AF',
            700: '#1B4398',
            800: '#123278',
            900: '#092056',
          },

          /** Neutrals **/
          // These are the colors you will use the most and will make up the majority of your UI.
          // Use them for most of your text, backgrounds, and borders,
          // as well as for things like secondary buttons and links.
          neutral: {
              50: '#F5F7FA',
              100: '#E4E7EB',
              200: '#CBD2D9',
              300: '#9AA5B1',
              400: '#7B8794',
              500: '#616E7C',
              600: '#52606D',
              700: '#3E4C59',
              800: '#323F4B',
              900: '#1F2933',
          },

          /** Supporting **/
          // These colors should be used fairly conservatively throughout your UI to avoid overpowering your primary colors.
          // Use them when you need an element to stand out,
          // or to reinforce things like error states or positive trends with the appropriate semantic color.
          supporting_red: {
              50: '#FFE3E3',
              100: '#FFBDBD',
              200: '#FF9B9B',
              300: '#F86A6A',
              400: '#EF4E4E',
              500: '#E12D39',
              600: '#CF1124',
              700: '#AB091E',
              800: '#8A041A',
              900: '#610316',
          },
          supporting_yellow: {
              50: '#FFFBEA',
              100: '#FFF3C4',
              200: '#FCE588',
              300: '#FADB5F',
              400: '#F7C948',
              500: '#F0B429',
              600: '#DE911D',
              700: '#CB6E17',
              800: '#B44D12',
              900: '#8D2B0B',
          },
          supporting_cyan: {
              50: '#E1FCF8',
              100: '#C1FEF6',
              200: '#92FDF2',
              300: '#62F4EB',
              400: '#3AE7E1',
              500: '#1CD4D4',
              600: '#0FB5BA',
              700: '#099AA4',
              800: '#07818F',
              900: '#05606E',
          },
          supporting_orange: {
              50: '#FFE8D9',
              100: '#FFD0B5',
              200: '#FFB088',
              300: '#FF9466',
              400: '#F9703E',
              500: '#F35627',
              600: '#DE3A11',
              700: '#C52707',
              800: '#AD1D07',
              900: '#841003',
          },
      }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
