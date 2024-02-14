const config = {
  /**
   * Outside of localhost visibility
   */
  // server: {
  //   host: '0.0.0.0',
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: 'SPARC Portal',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'nih sparc, sparc program, stimulating peripheral activity to relieve conditions, common fund sparc, sparc, sparc initiative, sparc neuro, sparc science'
      },
      // default social cards information for site sharing url's
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: 'SPARC Portal' },
      { hid: 'og:description', property: 'og:description', content: 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)' },
      { hid: 'og:image', property: 'og:image',
        content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
      },
      { hid: 'og:image:secure_url', property: 'og:image:secure_url',
        content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
      },
      { hid: 'og:url', property: 'og:url', content: process.env.ROOT_URL || 'sparc.science' },
      { hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@sparc_science' },
      { name: 'twitter:title', content: 'SPARC Portal' },
      { name: 'twitter:image', content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png' },
      { name: 'twitter:description', content: 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)' }
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
    bitly_expand_endpoint: 'https://api-ssl.bitly.com/v4/expand',
    ctf_event_id: 'event',
    ctf_news_id: 'news',
    ctf_community_spotlight_item_id: 'communitySpotlight',
    ctf_news_and_events_id: 'newsAndEvents',
    ctf_resource_id: 'sparcPartners',
    ctf_tools_and_resources_page_id: '1Yy2BEB0df8HxLNx2Ivsct',
    ctf_about_page_id: '4VOSvJtgtFv1PS2lklMcnS',
    ctf_about_portal_page_id: '2156L8jQgaifFNpgeylaQp',
    ctf_about_details_content_type_id: 'aboutPageSecondLevel',
    ctf_learn_more_item_id: 'learnMoreItem',
    ctf_what_we_offer_page_id: '4wuZ2gzxota1GLTFUXSLNb',
    ctf_share_data_page_id: '5w2F52873w6g9TH4YMVxXW',
    ctf_team_and_leadership_page_id: '7EL9Plxo7q2GyCzg1sqIcg',
    ctf_get_involved_page_id: 'jxEBoBw2zUctuDaX2eeX1',
    ctf_contact_us_form_type_id: 'contactUsForm',
    ctf_home_page_id: '4qJ9WUWXg09FAUvCnbGxBY',
    ctf_news_and_events_page_id: '4IoMamTLRlN3OpxT1zgnU',
    ctf_project_id: 'sparcAward',
    ctf_footer_copy_id: 'wpik0A2sDOy9IQEoKpkKG',
    ctf_contact_us_form_options_id: '79rwRA0rUqUj6rc913BFsz',
    ctf_portal_notification_entry_id: 'XiVlrkTXeKxTyN1Q2oY2Q',
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_API_HOST: process.env.CTF_API_HOST || 'preview.contentful.com',
    DEPLOY_ENV: process.env.DEPLOY_ENV || 'development',
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_INDEX: process.env.ALGOLIA_INDEX || 'k-core_dev',
    ALGOLIA_INDEX_VERSION_PUBLISHED_TIME_DESC: process.env.ALGOLIA_INDEX_VERSION_PUBLISHED_TIME_DESC || 'k-core_dev_version_published_time_desc',
    ALGOLIA_INDEX_VERSION_PUBLISHED_TIME_ASC: process.env.ALGOLIA_INDEX_VERSION_PUBLISHED_TIME_ASC || 'k-core_dev_version_published_time_asc',
    ALGOLIA_INDEX_ALPHABETICAL_A_Z: process.env.ALGOLIA_INDEX_ALPHABETICAL_A_Z || 'k-core_dev_alphabetical_a_z',
    ALGOLIA_INDEX_ALPHABETICAL_Z_A: process.env.ALGOLIA_INDEX_ALPHABETICAL_Z_A || 'k-core_dev_alphabetical_z_a',
    BITLY_ACCESS_TOKEN: process.env.BITLY_ACCESS_TOKEN,
    BL_API_URL: 'https://sparc.biolucida.net/api/v1/',
    BL_SERVER_URL: 'https://sparc.biolucida.net',
    BL_SHARE_LINK_PREFIX: 'https://sparc.biolucida.net/image?c=',
    MBF_SPARC_API: process.env.MBF_SPARC_API || 'https://mbfsparcapi.com',
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
    LOGIN_API_URL: process.env.LOGIN_API_URL || 'https://api.pennsieve.net',
    PENNSIEVE_API_VERSION_2: process.env.PENNSIEVE_API_VERSION_2 || 'https://api2.pennsieve.net',
    ORCID_API_URL: process.env.ORCID_API_URL || 'https://pub.orcid.org/v2.1',
    GOOGLE_ANALYTICS_UA: process.env.GOOGLE_ANALYTICS_UA,
    SHOW_TIMESERIES_VIEWER: process.env.SHOW_TIMESERIES_VIEWER || false,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    METRICS_URL: process.env.METRICS_URL || 'https://metrics.sparc.science',
    METACELL_SDS_VIEWER_URL: process.env.METACELL_SDS_VIEWER_URL || 'https://metacell.github.io/sds-viewer',
    SHOW_HIERARCHAL_FACETS: process.env.SHOW_HIERARCHAL_FACETS || 'false',
    SHOW_SDS_VIEWER: process.env.SHOW_SDS_VIEWER || 'false',
    SHOW_DATASET_SUBMISSION_FEATURE: process.env.SHOW_DATASET_SUBMISSION_FEATURE || 'false',
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID || 'GTM-TPT2CVCS'
  },

  serverMiddleware: [
  ],

  /*
   ** Customize the loading component
   */
  loading: '@/components/Loading/Loading.vue',

  /*
   ** Customize router classes globally
   */
  router: {
    linkActiveClass: 'active-link',
    extendRoutes(routes) {
      routes.push({
        name: 'version',
        path: '/datasets/:datasetId/version/:version',
        component: '@/pages/datasets/_datasetId.vue'
      })
    },
    middleware: ['documentationHubRedirects', 'signOutRedirect', 'clearDatalayer']
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
    '@nuxtjs/gtm',
    '@nuxtjs/axios',
    '@nuxtjs/robots',
    'cookie-universal-nuxt',
    '@miyaoka/nuxt-twitter-widgets-module',
    'vue-social-sharing/nuxt',
    '@nuxtjs/proxy',
    ['@nuxtjs/recaptcha', {
      siteKey: process.env.RECAPTCHA_SITE_KEY,
      version: "2"
    }]
  ],
  axios: {
    proxy: true
  },
  gtm: {
    id: 'GTM-TPT2CVCS',
    enabled: true,
    debug: true,

    layer: 'dataLayer',
    variables: {},

    pageTracking: true,
    pageViewEventName: 'nuxtRoute',

    autoInit: true,
    respectDoNotTrack: true,

    scriptId: 'gtm-script',
    scriptDefer: false,
    scriptURL: 'https://www.googletagmanager.com/gtm.js',
    crossOrigin: false,

    noscript: true,
    noscriptId: 'gtm-noscript',
    noscriptURL: 'https://www.googletagmanager.com/ns.html'
  },
  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
      enabled: process.env.ROOT_URL == 'http://localhost:3000' ? false : true,
      debug: true,
    }
  },
  proxy: {
    "/captcha-api/": {
      target: "https://www.google.com/recaptcha/api",
      pathRewrite: {
        "^/captcha-api": ""
      }
    }
  },
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
  },
}

if (process.env.DISABLE_REDIRECT_SSL !== 'true') {
  //Need to set a flag to disable redirect ssl for e2e testing
  //on github action. 
  config.serverMiddleware.push('redirect-ssl');
}


export default config
