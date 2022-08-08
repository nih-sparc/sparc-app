<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Community Announcements" />
    <page-hero>
      <h1>Community Announcements</h1>
      <br />
      <p>
        Stay up to date with the latest news from SPARC
      </p>
    </page-hero>
    <div class="page-wrap container mb-16">
      <community-announcement-listings :items="shownItems" />
    </div>
    <pagination
      v-if="items.length > pageSize"
      :page-size="pageSize"
      :total-count="items.length"
      @select-page="pageChange"
    />
  </div>
</template>

<script>
import createClient from '@/plugins/contentful.js'
import PageHero from '@/components/PageHero/PageHero.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import CommunityAnnouncementListings from '@/components/CommunityAnnouncements/CommunityAnnouncementListings.vue'

const client = createClient()

export default {
  name: 'CommunityAnnouncementsPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunityAnnouncementListings,
  },

  async asyncData() {
    const news = await client.getEntries({
      content_type: 'news',
      order: '-fields.publishedDate'
    })
    return {
      items: news.items
    }
  },

  data() {
    return {
      items: [],
      pageSize: 10,
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
    shownItems: function() {
      return this.items.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize
      )
    }
  },

  methods: {
    pageChange: function(val) {
      this.page = val
      window.items = this.items
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
