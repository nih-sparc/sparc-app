<template>
  <div>
    <page-hero class="large">
      <div class="row">
        <div class="col">
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
        </div>
        <div class="col">
          <img class="page-hero-img" src="@/static/images/about-hero.png" />
        </div>
      </div>
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
  }
}
</script>

<style lang="scss" scoped>
.page-hero {
  padding: 0;
  height: 19rem;
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  h1 {
    margin-top: 2rem;
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) {
    p {
      position: absolute;
      background-color: rgba(36, 36, 91, 0.75);
      top: 167px;
    }
    .btn-link {
      margin-top: 12rem;
    }

    .row {
      &.col {
        position: absolute;
      }
    }

    h1 {
      font-size: 1.45rem;
      position: absolute;
    }
  }

  @media screen and (max-width: 767px) {
    h1 {
      font-size: 1.45rem;
    }
  }

  .page-hero-img {
    height: 19rem;
    @media screen and (max-width: 767px) {
      display: none;
    }
    @media screen and (min-width: 768px) and (max-width: 1023px) {
      margin-left: 14rem;
    }
  }

  .row {
    display: flex;
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
