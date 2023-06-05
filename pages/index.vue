<template>
  <div class="page-data">
    <page-hero>
      <h1 v-if="heroHeading">
        {{ heroHeading }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(heroCopy)" />
      <img
        v-if="heroImage"
        slot="image"
        class="page-hero-img"
        :src="heroImage.fields.file.url"
      />
    </page-hero>
    <div class="secondary-background">
      <featured-data :featured-data="featuredData" />
    </div>
    <hr />
    <portal-features :features="portalFeatures" />
    <hr />
    <div class="secondary-background">
      <projects-and-datasets :datasetSectionTitle="datasetSectionTitle" :projectOrResource="featuredProject" :dataset="featuredDataset" />
    </div>
    <hr />
    <homepage-news :news="newsAndEvents" />
    <hr />
    <div class="secondary-background">
      <stay-connected />
    </div>
  </div>
</template>

<script>
import PageHero from '@/components/PageHero/PageHero.vue'
import FeaturedData from '@/components/FeaturedData/FeaturedData.vue'
import HomepageNews from '@/components/HomepageNews/HomepageNews.vue'
import PortalFeatures from '@/components/PortalFeatures/PortalFeatures.vue'
import ProjectsAndDatasets from '@/components/ProjectsAndDatasets/ProjectsAndDatasets.vue'
import StayConnected from '@/components/StayConnected/StayConnected.vue'

import createClient from '@/plugins/contentful.js'
import ContentfulErrorHandle from '@/mixins/contentful-error-handle'
import marked from '@/mixins/marked/index'
import getHomepageFields from '@/utils/homepageFields'
import { mapGetters } from 'vuex'
import { pathOr } from 'ramda'

const client = createClient()
export default {
  name: 'SparcHomepage',

  components: {
    PageHero,
    FeaturedData,
    HomepageNews,
    PortalFeatures,
    ProjectsAndDatasets,
    StayConnected
  },

  mixins: [ContentfulErrorHandle, marked],

  asyncData({ $axios }) {
    return Promise.all([
      // Get homepage content
      client.getEntry(process.env.ctf_home_page_id)
    ]).then(async ([homepage]) => {
        let fields = getHomepageFields(homepage.fields)
        const datasetSectionTitle = homepage.fields.datasetSectionTitle
        const url = `${process.env.portal_api}/get_featured_dataset`
        await $axios.$get(url).then(({ datasets }) => {
          fields = { ...fields, 'featuredDataset': { 'title': datasets[0].name, 'description': datasets[0].description, 'banner': datasets[0].banner, 'id': datasets[0].id }, 'datasetSectionTitle': datasetSectionTitle }
        })
        if (pathOr(undefined, ["featuredProject","fields","institution"], fields) != undefined) {
          const institutionId = pathOr("", ["featuredProject","fields","institution","sys","id"], fields)
          await client.getEntry(institutionId).then(( response ) => {
            fields.featuredProject.fields = { ...fields.featuredProject.fields, 'banner': response.fields.logo.fields.file.url }
          })
        }
        return fields
      }).catch(e => {
        console.error(e);
        //The contentful error handle mixin will
        //emit a message on the failure.
        return { contentfulError: true }
      })
  },
  
  watch: {
    cognitoUserToken: function (val) {
      if (val != '') {
        const profileComplete = this.$cookies.get('profile-complete') || this.profileComplete
        if (!profileComplete) {
          this.$router.push("/welcome")
        }
      }
    }
  },

  computed: {
    ...mapGetters('user', ['cognitoUserToken', 'profileComplete']),
  },

  beforeMount() {
    // When trying to do federated sign in using a middleware (like we do for sign out), Cognito's callback would only
    // execute client-side (after the middleware had already redirected to the new page) causing it to overwrite the 
    // previous redirect. This issue was supposed to be addressed by https://github.com/aws-amplify/amplify-js/pull/3588, 
    // but attempting to handle dynamic routing after amplify federated sign in via a custom state hook as suggested 
    // here: https://github.com/aws-amplify/amplify-js/issues/3125#issuecomment-814265328 did not work
    const authRedirectUrl = this.$cookies.get('sign-in-redirect-url')
    if (authRedirectUrl) {
      this.$cookies.set('sign-in-redirect-url', null)
      this.$router.push(authRedirectUrl)
    }
  },

  data: () => {
    return {
      featuredData: [],
      newsAndEvents: [],
      portalFeatures: [],
      featuredProject: {},
      datasetSectionTitle: '',
      featuredDataset: {},
      heroCopy: '',
      heroHeading: '',
      heroImage: {}
    }
  },

  head() {
    return {
      meta: [
        {
          name: 'description',
          content:
            'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:title',
          content: 'SPARC Portal'
        },
        {
          name: 'og:description',
          content:
            'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
        },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url',
          content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
        },
        {
          name: 'og:site_name',
          content: 'SPARC Portal'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@sparc_science'
        },
        {
          name: 'twitter:title',
          content: 'SPARC Portal'
        },
        {
          name: 'twitter:image',
          content: 'https://images.ctfassets.net/6bya4tyw8399/7r5WTb92QnHkub8RsExuc1/2ac134de2ddfd65eb6316421df7578f9/sparc-logo-primary.png'
        },
        {
          name: 'twitter:description',
          content: 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page-data {
  background-color: #f8faff;
}
.secondary-background {
  background-color: $background;
}
::v-deep h2 {
  font-size: 1.5em;
  font-weight: 500;
  line-height: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  @media (min-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 2rem;
  }
}
.page-hero-video {
  width: 406px;
}

hr {
  margin: 0;
  padding: 0;
  border-top: none;
  border-color: $lineColor1;
}
</style>
