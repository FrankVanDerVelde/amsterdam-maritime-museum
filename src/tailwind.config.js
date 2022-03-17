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
            50: '#E3F8FF',
            100: '#B3ECFF',
            200: '#81DEFD',
            300: '#5ED0FA',
            400: '#40C3F7',
            500: '#2BB0ED',
            600: '#1992D4',
            700: '#127FBF',
            800: '#0B69A3',
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
          supporting_pink: {
              50: '#FFE3EC',
              100: '#FFB8D2',
              200: '#FF8CBA',
              300: '#F364A2',
              400: '#E8368F',
              500: '#DA127D',
              600: '#BC0A6F',
              700: '#A30664',
              800: '#870557',
              900: '#620042',
          },
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
          supporting_teal: {
              50: '#EFFCF6',
              100: '#C6F7E2',
              200: '#8EEDC7',
              300: '#65D6AD',
              400: '#3EBD93',
              500: '#27AB83',
              600: '#199473',
              700: '#147D64',
              800: '#0C6B58',
              900: '#014D40',
          },
      }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
