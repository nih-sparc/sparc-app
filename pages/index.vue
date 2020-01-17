<template>
  <div>
    <page-hero>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <bf-button class="white">
        Browse All Data
      </bf-button>
    </page-hero>

    <featured-datasets />

    <homepage-news :news="newsAndEvents" />

    <homepage-testimonials :testimonials="testimonials" />

    <homepage-twitter />
  </div>
</template>

<script>
import BfButton from '@/components/shared/BfButton/BfButton.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import FeaturedDatasets from '@/components/FeaturedDatasets/FeaturedDatasets.vue'
import HomepageNews from '@/components/HomepageNews/HomepageNews.vue'
import HomepageTestimonials from '@/components/HomepageTestimonials/HomepageTestimonials.vue'
import HomepageTwitter from '@/components/HomepageTwitter/HomepageTwitter.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()
export default {
  name: 'SparcHomepage',

  components: {
    BfButton,
    PageHero,
    FeaturedDatasets,
    HomepageNews,
    HomepageTestimonials,
    HomepageTwitter
  },

  asyncData() {
    return Promise.all([
      // Get homepage content
      client.getEntry( process.env.ctf_home_page_id)
    ])
      .then(([homepage]) => {
        return { ...homepage.fields }
      })
      .catch(console.error)
  },

  data: () => {
    return {
      newsAndEvents: [],
      testimonials: []
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep h2 {
  font-size: 1em;
  font-weight: 700;
  line-height: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  @media (min-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 2rem;
  }
}
</style>
