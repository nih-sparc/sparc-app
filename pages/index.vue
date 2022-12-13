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
      <projects-and-datasets :project="featuredProject" :dataset="featuredDataset" />
    </div>
    <hr />
    <latest-news-and-events />
    <stay-connected />
  </div>
</template>

<script>
import PageHero from '@/components/PageHero/PageHero.vue'
import FeaturedData from '@/components/FeaturedData/FeaturedData.vue'
import PortalFeatures from '@/components/PortalFeatures/PortalFeatures.vue'
import ProjectsAndDatasets from '@/components/ProjectsAndDatasets/ProjectsAndDatasets.vue'
import LatestNewsAndEvents from '@/components/LatestNewsAndEvents/LatestNewsAndEvents.vue'
import StayConnected from '@/components/StayConnected/StayConnected.vue'

import createClient from '@/plugins/contentful.js'
import ContentfulErrorHandle from '@/mixins/contentful-error-handle'
import marked from '@/mixins/marked/index'
import getHomepageFields from '@/utils/homepageFields'
import { mapGetters } from 'vuex'

const client = createClient()
export default {
  name: 'SparcHomepage',

  components: {
    PageHero,
    FeaturedData,
    PortalFeatures,
    ProjectsAndDatasets,
    LatestNewsAndEvents,
    StayConnected
  },

  mixins: [ContentfulErrorHandle, marked],

  asyncData({ $axios }) {
    return Promise.all([
      // Get homepage content
      client.getEntry(process.env.ctf_home_page_id)
    ]).then(async ([homepage]) => {
        let fields = getHomepageFields(homepage.fields)
        const featuredDatasetId = homepage.fields.featuredDatasetId
        if (featuredDatasetId != '') {
          const url = `${process.env.discover_api_host}/datasets/${featuredDatasetId}`
          await $axios.$get(url).then(({ name, description, banner }) => {
            fields = { ...fields, 'featuredDataset': { 'title': name, 'description': description, 'banner': banner, 'id': featuredDatasetId } }
          })
        }
        if (fields.featuredProject.fields.institution != undefined) {
          const institutionId = fields.featuredProject.fields.institution.sys.id
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
        const profileComplete = this.$cookies.get('profile-complete')
        if (!profileComplete) {
          this.$router.push("/welcome")
        }
      }
    }
  },

  computed: {
    ...mapGetters('user', ['cognitoUserToken']),
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
      portalFeatures: [],
      featuredProject: {},
      featuredDatasetId: '',
      featuredDataset: {},
      heroCopy: '',
      heroHeading: '',
      heroImage: {}
    }
  },

  head() {
    return {
      title: 'SPARC Portal',
      titleTemplate: '%s - SPARC Portal',
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
          name: 'twitter:description',
          content:
            'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page-data {
  background-color: $background;
}
.secondary-background {
  background-color: #f8faff;
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
