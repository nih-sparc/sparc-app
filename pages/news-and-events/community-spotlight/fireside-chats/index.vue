<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Fireside Chats" />
    <page-hero>
      <h1>Fireside Chats</h1>
      <br />
      <p>
        Watch SPARC investigators share their latest research
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
  name: 'CommunityChatsPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunitySpotlightListings,
  },

  async asyncData() {
    const firesideChats = await client.getEntries({
      content_type: 'firesideChat',
      order: '-fields.publishedDate',
    })
    return {
      allStories: firesideChats.items
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
