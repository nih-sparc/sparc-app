<template>
  <div>
    <page-hero class="large">
      <h2 v-if="heroHeading">{{ heroHeading }}</h2>
      <p>
        {{ heroCopy }}
      </p>
      <a v-if="heroButtonLink" class="btn-link" :href="heroButtonLink">
        <el-button class="uppercase">
          {{ heroButtonLabel }}
        </el-button>
      </a>
    </page-hero>

    <featured-data />

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
      testimonials: [],
      heroCopy: '',
      heroHeading: '',
      heroButtonLink: '',
      heroButtonLabel: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.page-hero  {
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
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
</style>
