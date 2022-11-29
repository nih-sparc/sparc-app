export default {
  /**
   * Outside of localhost visibility
   */
  // server: {
  //   host: '0.0.0.0'
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: 'SPARC Portal' || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        hid: 'keywords', 
        name: 'keywords', 
        content: 'nih sparc, sparc program, stimulating peripheral activity to relieve conditions, common fund sparc, sparc, sparc initiative, sparc neuro, sparc science'
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
    portal_api: process.env.PORTAL_API_HOST || 'https://sparc-api.herokuapp.com',
    flatmap_api:
      process.env.FLATMAP_API_HOST || 'https://mapcore-demo.org/current/flatmap/v3/',
    crosscite_api_host:
      process.env.CROSSCITE_API_HOST || 'https://citation.crosscite.org',
    discover_api_host:
      process.env.PENNSIEVE_DISCOVER_API_HOST || 'https://api.pennsieve.io/discover',
    zipit_api_host:
      process.env.ZIPIT_API_HOST || 'https://api.pennsieve.io/zipit/discover',
    osparc_host: process.env.OSPARC_HOST || 'https://osparc.io',
    ctf_event_id: 'event',
    ctf_news_id: 'news',
    ctf_community_spotlight_item_id: 'communitySpotlight',
    ctf_news_and_events_id: 'newsAndEvents',
    ctf_resource_id: 'sparcPartners',
    ctf_resource_hero_id: '3ImGx7UyDXPwM3oTag06nt',
    ctf_tools_and_resources_page_id: '1Yy2BEB0df8HxLNx2Ivsct',
    ctf_help_id: 'helpDocument',
    ctf_help_list_id: 'helpSection',
    ctf_help_aws_id: 'zQfzadwADutviJjT19hA5',
    ctf_about_page_id: '4VOSvJtgtFv1PS2lklMcnS',
    ctf_about_portal_page_id: '2156L8jQgaifFNpgeylaQp',
    ctf_about_details_content_type_id: 'aboutPageSecondLevel',
    ctf_about_details_page_types: ['Policies', 'Portal', 'Team', 'Get Involved', 'What We Offer'],
    ctf_what_we_offer_page_id: '4wuZ2gzxota1GLTFUXSLNb',
    ctf_team_and_leadership_page_id: '7EL9Plxo7q2GyCzg1sqIcg',
    ctf_get_involved_page_id: 'jxEBoBw2zUctuDaX2eeX1',
    ctf_about_policies_page_id: '71a9NzpuHvaTpgTf9ir1xg',
    ctf_contact_us_page_id: '7t2GZ5F74AdNRqBau4mp8S',
    ctf_support_page_id: '59F0dM5goobqjw3TsqINRw',
    ctf_home_page_id: '4qJ9WUWXg09FAUvCnbGxBY',
    ctf_news_and_events_page_id: '4IoMamTLRlN3OpxT1zgnU',
    ctf_dataset_navigation_info_page_id: 'qvEcnv56c76V0JC0KvtSd',
    ctf_dataset_format_info_page_id: '3FXikFXC8shPRd8xZqhjVT',
    ctf_project_id: 'sparcAward',
    ctf_organ_id: 'organ',
    ctf_filter_id: '6bya4tyw8399',
    ctf_filters_dataset_id: '7fL88ABgKSB2tPJmysn2V',
    ctf_filters_project_id: 'YVan5NSd4bgj2Q5WZdOVw',
    ctf_filters_organ_id: '5Hhlb7Lf4yijMQUSBai1fh',
    ctf_filters_image_id: '4R4zfdND13xLLGU9nPpNCD',
    ctf_filters_simulation_id: '6qMQRugMyzeaUrTIPQDdF1',
    ctf_footer_copy_id: 'wpik0A2sDOy9IQEoKpkKG',
    ctf_terms_id: '6XCER8v1TVVCoZdaBWg66t',
    ctf_privacy_policy_id: '2p44GCn1rrWUETwTRF2ElS',
    ctf_success_story_id: 'successStory',
    ctf_documentation_hub_redirects_id: 'yhBSKvDSpBQbeHQWHgj9j',
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_API_HOST: process.env.CTF_API_HOST,
    DEPLOY_ENV: process.env.DEPLOY_ENV || 'development',
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_INDEX: process.env.ALGOLIA_INDEX || 'k-core_dev',
    ALGOLIA_INDEX_PUBLISHED_TIME_DESC: process.env.ALGOLIA_INDEX_PUBLISHED_TIME_DESC || 'k-core_dev_published_time_desc',
    ALGOLIA_INDEX_PUBLISHED_TIME_ASC: process.env.ALGOLIA_INDEX_PUBLISHED_TIME_ASC || 'k-core_dev_published_time_asc',
    ALGOLIA_INDEX_ALPHABETICAL_A_Z: process.env.ALGOLIA_INDEX_ALPHABETICAL_A_Z || 'k-core_dev_alphabetical_a_z',
    ALGOLIA_INDEX_ALPHABETICAL_Z_A: process.env.ALGOLIA_INDEX_ALPHABETICAL_Z_A || 'k-core_dev_alphabetical_z_a',
    BL_API_URL: 'https://sparc.biolucida.net/api/v1/',
    BL_SERVER_URL: 'https://sparc.biolucida.net',
    BL_SHARE_LINK_PREFIX: 'https://sparc.biolucida.net/image?c=',
    NL_LINK_PREFIX: 'https://sparc.biolucida.net:8081',
    ROOT_URL: process.env.ROOT_URL || 'http://localhost:3000',
    max_download_size: parseInt(process.env.MAX_DOWNLOAD_SIZE || '5000000000'),
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_USER_POOL_ID: process.env.AWS_USER_POOL_ID || 'us-east-1_FVLhJ7CQA',
    AWS_USER_POOL_WEB_CLIENT_ID: process.env.AWS_USER_POOL_WEB_CLIENT_ID || '',
    AWS_USER_AUTHENTICATION_FLOW_TYPE: process.env.AWS_USER_AUTHENTICATION_FLOW_TYPE || 'USER_PASSWORD_AUTH',
    AWS_OAUTH_DOMAIN: process.env.AWS_OAUTH_DOMAIN || 'pennsieve-dev-users2.auth.us-east-1.amazoncognito.com',
    AWS_OAUTH_SCOPE: process.env.AWS_OAUTH_SCOPE || ["openid"],
    AWS_OAUTH_REDIRECT_SIGN_IN_URL: process.env.AWS_OAUTH_REDIRECT_SIGN_IN_URL || 'http://localhost:3000',
    AWS_OAUTH_REDIRECT_SIGN_OUT_URL: process.env.AWS_OAUTH_REDIRECT_SIGN_OUT_URL || 'http://localhost:3000',
    AWS_OAUTH_RESPONSE_TYPE: process.env.AWS_OAUTH_RESPONSE_TYPE || "token",
    SHOW_LOGIN_FEATURE: process.env.SHOW_LOGIN_FEATURE || 'false',
    LOGIN_API_URL: process.env.LOGIN_API_URL || 'https://api.pennsieve.net',
    ORCID_API_URL: process.env.ORCID_API_URL || 'https://pub.orcid.org/v2.1',
    GOOGLE_ANALYTICS_GA4: process.env.GOOGLE_ANALYTICS_GA4,
    GOOGLE_ANALYTICS_UA: process.env.GOOGLE_ANALYTICS_UA,
    SHOW_TIMESERIES_VIEWER: process.env.SHOW_TIMESERIES_VIEWER || false
  },

  serverMiddleware: [
    // Will register redirect-ssl npm package
    'redirect-ssl'
  ],

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Customize router classes globally
   */
  router: {
    linkActiveClass: 'active-link',
    extendRoutes(routes) {
      // Redirects
      routes.push({
        path: '/submit_data.html',
        redirect: '/help/7k8nEPuw3FjOq2HuS8OVsd'
      })
      routes.push({
        name: 'version',
        path: '/datasets/:datasetId/version/:version',
        component: '@/pages/datasets/_datasetId.vue'
      })
    },
    middleware: ['verifyUserProfileComplete', 'documentationHubRedirects']
  },
  /*
   ** Global CSS
   */
  css: ['element-ui/lib/theme-chalk/index.css', '@nih-sparc/sparc-design-system-components/src/assets/styles.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/bootstrap',
    '@/plugins/contentful',
    '@/plugins/amplify',
    '@/plugins/documentation-hub-redirects',
    "@/plugins/vue-gtag.client.js",
    { src: '@/plugins/postscribe', mode: 'client' },
    { src: '@/plugins/system-design-components', mode: 'client' },
    { src: '@/plugins/tsviewer', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    [
      '@nuxtjs/google-analytics',
      {
        id: process.env.GOOGLE_ANALYTICS_UA
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/robots',
    'cookie-universal-nuxt',
    '@miyaoka/nuxt-twitter-widgets-module',
    'vue-social-sharing/nuxt'
  ],
  /*
   ** robots.txt
   */
  robots: [
    {
      // all environment
      UserAgent: '*',

      // disallow all in all environments except production
      Disallow: () => (process.env.DEPLOY_ENV !== 'production' ? '/' : [])
    }
  ],
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/, 'system-design-components'],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true
      }
    }
  }
}
