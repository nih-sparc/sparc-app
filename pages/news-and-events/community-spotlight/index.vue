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
    <div class="page-wrap container">
      <h2>Fireside Chats</h2>
      <community-spotlight-listings :stories="shownChats" :bottomLink="true" linkLocation="news-and-events-community-spotlight-fireside-chats" linkText="View all Fireside Chats"/>
    </div>
    <div class="page-wrap container">
      <h2>Community Announcements</h2>
      <community-announcement-listings :items="shownAnnouncements" :bottomLink="true" linkLocation="news-and-events-community-spotlight-community-announcements" linkText="View all Community Announcements"/>
    </div>
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
      return this.allStories.slice(0, this.storiesPageSize)
    },
    shownChats: function() {
      return this.allChats.slice(0, this.chatsPageSize)
    },
    shownAnnouncements: function() {
      return this.allAnnouncements.slice(0, this.announcementsPageSize)
    }
  },
  data() {
    return {
      storiesPageSize: 5,
      chatsPageSize: 5,
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
.page-wrap {
  padding-top: 3rem;
  max-width: 80rem;
}
</style>
