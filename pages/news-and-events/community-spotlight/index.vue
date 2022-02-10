<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Community Spotlight" />
    <page-hero>
      <h1>Community Spotlight</h1>
      <br />
      <p>
        Hear about how the SPARC community are using the SPARC Portal, including
        Success Stories and Fireside Chats. Also, keep up to date with Community Announcements.
      </p>
    </page-hero>
    <div class="page-wrap container">
      <h2>Success Stories</h2>
      <community-spotlight-listings :stories="shownStories" :bottomLink="true" linkLocation="news-and-events-community-spotlight-success-stories" linkText="View all Success Stories"/>
      <h2>Fireside Chats</h2>
      <community-spotlight-listings :stories="fireSideChats" />
      <h2>Community Announcements</h2>
      <community-announcement-listings :stories="communityAnnouncements" />
    </div>
    <pagination
      v-if="allStories.length > pageSize"
      :selected="curSearchPage"
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
import CommunityAnnouncementListings from '@/components/CommunityAnnouncements/CommunityAnnouncementListings.vue'

const client = createClient()

export default {
  name: 'CommunityPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunitySpotlightListings,
    CommunityAnnouncementListings
  },

  async asyncData() {
    const successData = await client.getEntries({
      content_type: 'successStoryDisplay'
    })
    const fireSideChats = await client.getEntries({
      content_type: 'firesideChat'
    })
    const communityAnnouncements = await client.getEntries({
      content_type: 'news'
    })
    return {
      allStories: successData.items,
      fireSideChats: fireSideChats.items,
      communityAnnouncements: communityAnnouncements.items
    }
  },

  methods: {
    pageChange: function(val) {
      this.page = val
    }
  },

  data() {
    return {
      allStories: [],
      page: 1,
      pageSize: 5,
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
}

.page-wrap {
  padding-top: 3em;
  max-width: 80em;
}

.subpage {
  margin-bottom: 20px;
}
</style>
