export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }]
  },
  env: {
    portal_api: process.env.PORTAL_API_HOST || 'http://localhost:4000',
    crosscite_api_host:
      process.env.CROSSCITE_API_HOST || 'https://crosscite.org',
    discover_api_host:
      process.env.BLACKFYNN_DISCOVER_API_HOST ||
      'https://api.blackfynn.io/discover',
    ctf_event_id: 'event',
    ctf_help_id: 'helpDocument',
    ctf_help_list_id: 'helpSection',
    ctf_support_page_id: '59F0dM5goobqjw3TsqINRw',
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_API_HOST: process.env.CTF_API_HOST
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['element-ui/lib/theme-chalk/index.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/bootstrap', '@/plugins/contentful'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios'],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
