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
    </div>
    <pagination
      v-if="allStories.length > storiesPageSize"
      :page-size="storiesPageSize"
      :total-count="allStories.length"
      @select-page="storiesPageChange"
    />
    <div class="page-wrap container">
      <h2>Fireside Chats</h2>
      <community-spotlight-listings :stories="shownChats" :bottomLink="true" linkLocation="news-and-events-community-spotlight-fireside-chats" linkText="View all Fireside Chats"/>
    </div>
    <pagination
      v-if="allChats.length > chatsPageSize"
      :page-size="chatsPageSize"
      :total-count="allChats.length"
      @select-page="chatsPageChange"
    />
    <div class="page-wrap container">
      <h2>Community Announcements</h2>
      <community-announcement-listings :items="shownAnnouncements" :bottomLink="true" linkLocation="news-and-events-community-spotlight-community-announcements" linkText="View all Community Announcements"/>
    </div>
    <pagination
      v-if="allAnnouncements.length > announcementsPageSize"
      :page-size="announcementsPageSize"
      :total-count="allAnnouncements.length"
      @select-page="announcementsPageChange"
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
      allChats: fireSideChats.items,
      allAnnouncements: communityAnnouncements.items
    }
  },
  computed: {
    shownStories: function() {
      return this.allStories.slice(
        (this.storiesPage - 1) * this.storiesPageSize,
        this.storiesPage * this.storiesPageSize
      )
    },
    shownChats: function() {
      return this.allChats.slice(
        (this.chatsPage - 1) * this.chatsPageSize,
        this.chatsPage * this.chatsPageSize
      )
    },
    shownAnnouncements: function() {
      return this.allAnnouncements.slice(
        (this.announcementsPage - 1) * this.announcementsPageSize,
        this.announcementsPage * this.announcementsPageSize
      )
    },
  },
  methods: {
    storiesPageChange: function(val) {
      this.storiesPage = val
    },
    chatsPageChange: function(val) {
      this.chatsPage = val
    },
    announcementsPageChange: function(val) {
      this.announcementsPage = val
    }
  },
  data() {
    return {
      allStories: [],
      storiesPage: 1,
      storiesPageSize: 5,
      chatsPage: 1,
      chatsPageSize: 5,
      announcementsPage: 1,
      announcementsPageSize: 5,
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
  font-size: 30px;
}

.page-wrap {
  padding-top: 3em;
  max-width: 80em;
}
</style>
