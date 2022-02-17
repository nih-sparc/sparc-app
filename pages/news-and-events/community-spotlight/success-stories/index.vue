<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Success Stories" />
    <page-hero>
      <h1>Success Stories</h1>
      <br />
      <p>
        Learn how researchers have used the SPARC Program to advance
        neuromodulation of the ANS. Submit your success story
      </p>
    </page-hero>
    <div class="page-wrap container mb-16">
      <community-spotlight-listings :stories="shownStories" />
    </div>
    <pagination
      v-if="allStories.length > pageSize"
      :page-size="pageSize"
      :total-count="allStories.length"
      @select-page="pageChange"
    />
  </div>
</template>

<script>
import createClient from '@/plugins/contentful.js'
import PageHero from '@/components/PageHero/PageHero.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import CommunitySpotlightListings from '@/components/CommunitySpotlight/CommunitySpotlightListings.vue'

const client = createClient()

export default {
  name: 'CommunityStoriesPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunitySpotlightListings,
  },

  async asyncData() {
    const successData = await client.getEntries({
      content_type: 'successStoryDisplay'
    })
    return {
      allStories: successData.items
    }
  },

  data() {
    return {
      allStories: [],
      pageSize: 4,
      page: 1,
      videoSrc: '',
      isLoadingSearch: false,
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        },
        {
          label: 'News & Events',
          to: {
            name: 'news-and-events'
          }
        },
        {
          label: 'Community Spotlight',
          to: {
            name: 'news-and-events-community-spotlight'
          }
        }
      ]
    }
  },

  computed: {
    shownStories: function() {
      return this.allStories.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize
      )
    }
  },

  methods: {
    pageChange: function(val) {
      this.page = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.page-wrap {
  max-width: 80rem;
}
</style>
