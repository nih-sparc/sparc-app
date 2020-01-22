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
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Asap:400,400i,500,600,700&display=swap'
      }
    ]
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
    ctf_about_page_id: '4VOSvJtgtFv1PS2lklMcnS',
    ctf_support_page_id: '59F0dM5goobqjw3TsqINRw',
    ctf_home_page_id: '4qJ9WUWXg09FAUvCnbGxBY',
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_API_HOST: process.env.CTF_API_HOST
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Customize router classes globally
   */
  // router : {
  //   linkActiveClass: 'active-link'
  // }
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
  modules: ['@nuxtjs/axios', '@nuxtjs/robots'],
  /*
   ** robots.txt
   */
  robots: [
    {
      // all environment
      UserAgent: '*',

      // disallow all in all environments except production
      Disallow: () => (process.env.NODE_ENV !== 'production' ? '/' : [])
    }
  ],
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
