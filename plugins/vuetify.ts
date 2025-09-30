// plugins/vuetify.ts
import { defineNuxtPlugin } from 'nuxt/app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light', // start with light theme
      themes: {
        light: {
          colors: {
            primary: '#07344dff',     // dark navy for main elements
            secondary: '#FF8C42',   // orange accent
            background: '#b5bfbfdf',  // soft gray background
            surface: '#181818',     // charcoal black for cards/text
            accent: '#13AEFB',      // blue highlights/icons
            error: '#FF4C4C',       // optional extra colors
            info: '#13AEFB',
            success: '#4CAF50',
            warning: '#E78F0A',
          },
        },
        dark: {
          colors: {
            primary: '#137CB5',     // vibrant blue for dark theme
            secondary: '#E78F0A',   // orange-gold accent
            background: '#062536',  // dark navy background
            surface: '#181818',     // charcoal black for cards/text
            accent: '#13AEFB',      // accent blue
            error: '#FF4C4C',
            info: '#13AEFB',
            success: '#4CAF50',
            warning: '#FFB74D',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
