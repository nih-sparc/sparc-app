<template>
  <div class="page-data">
    <page-hero>
      <h1 v-if="heroHeading">
        {{ heroHeading }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(heroCopy)" />
      <a
        class="btn-link"
        href="https://docs.sparc.science/docs/what-can-i-do-with-sparc"
      >
        <el-button class="secondary">
          What can I do with SPARC?
        </el-button>
      </a>
      <a v-if="heroButtonLink" class="btn-link" :href="heroButtonLink">
        <el-button class="secondary">
          {{ heroButtonLabel }}
        </el-button>
      </a>
      <img
        v-if="heroImage"
        slot="image"
        class="page-hero-img"
        :src="heroImage.fields.file.url"
      />
    </page-hero>

    <featured-data :featured-data="featuredData" />

    <homepage-news :news="newsAndEvents" />

    <homepage-testimonials :testimonials="testimonials" />
  </div>
</template>

<script>
import PageHero from '@/components/PageHero/PageHero.vue'
import FeaturedData from '@/components/FeaturedData/FeaturedData.vue'
import HomepageNews from '@/components/HomepageNews/HomepageNews.vue'
import HomepageTestimonials from '@/components/HomepageTestimonials/HomepageTestimonials.vue'

import createClient from '@/plugins/contentful.js'
import ContentfulErrorHandle from '@/mixins/contentful-error-handle'
import marked from '@/mixins/marked/index'
import getHomepageFields from '@/utils/homepageFields'

const client = createClient()
export default {
  name: 'SparcHomepage',

  components: {
    PageHero,
    FeaturedData,
    HomepageNews,
    HomepageTestimonials
  },

  mixins: [ContentfulErrorHandle, marked],

  asyncData({error}) {
    return Promise.all([
      // Get homepage content
      client.getEntry(process.env.ctf_home_page_id)
    ])
      .then(([homepage]) => {
        return getHomepageFields(homepage.fields)
      })
      .catch(e => {
        console.error(e);
        return { contentfulError: true }
      })
  },

  mounted() {
    // When trying to do this using a middleware, the server would redirect correctly initially after login,
    // but then another unknown redirect back to / was happening that would cause the page to load incorrectly.
    // The only downside to doing it this way is a momentary display of the home page first before redirecting.
    const authRedirectUrl = this.$cookies.get('auth-redirect-url')
    if (authRedirectUrl) {
      this.$cookies.set('auth-redirect-url', null)
      this.$router.push(authRedirectUrl)
    }
  },

  data: () => {
    return {
      featuredData: [],
      newsAndEvents: [],
      testimonials: [],
      heroCopy: '',
      heroHeading: '',
      heroButtonLink: '',
      heroButtonLabel: ''
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
</style>
