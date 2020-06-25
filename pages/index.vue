<template>
  <div>
    <page-hero>
      <h1 v-if="heroHeading">
        {{ heroHeading }}
      </h1>
      <p>
        {{ heroCopy }}
      </p>
      <a v-if="heroButtonLink" class="btn-link" :href="heroButtonLink">
        <el-button class="uppercase">
          {{ heroButtonLabel }}
        </el-button>
      </a>
      <video
        v-if="heroImage"
        slot="image"
        class="page-hero-video"
        autoplay
        muted
      >
        <source :src="heroImage.fields.file.url" type="video/mp4" />
      </video>
    </page-hero>

    <featured-data :featured-data="featuredData" />

    <homepage-news :news="newsAndEvents" />

    <homepage-testimonials :testimonials="testimonials" />

    <homepage-twitter />
  </div>
</template>

<script>
import PageHero from '@/components/PageHero/PageHero.vue'
import FeaturedData from '@/components/FeaturedData/FeaturedData.vue'
import HomepageNews from '@/components/HomepageNews/HomepageNews.vue'
import HomepageTestimonials from '@/components/HomepageTestimonials/HomepageTestimonials.vue'
import HomepageTwitter from '@/components/HomepageTwitter/HomepageTwitter.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()
export default {
  name: 'SparcHomepage',

  components: {
    PageHero,
    FeaturedData,
    HomepageNews,
    HomepageTestimonials,
    HomepageTwitter
  },

  asyncData() {
    return Promise.all([
      // Get homepage content
      client.getEntry(process.env.ctf_home_page_id)
    ])
      .then(([homepage]) => {
        return { ...homepage.fields }
      })
      .catch(console.error)
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
