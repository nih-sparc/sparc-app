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
  </div>
</template>

<script>
import createClient from '@/plugins/contentful.js'
import PageHero from '@/components/PageHero/PageHero.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import CommunitySpotlightListings from '@/components/CommunitySpotlight/CommunitySpotlightListings.vue'

const client = createClient()

export default {
  name: 'CommunityPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunitySpotlightListings
  },

  async asyncData() {
    const storiesPageSize = 5
    const chatsPageSize = 5
    const announcementsPageSize = 5
    const successData = await client.getEntries({
      content_type: 'successStoryDisplay',
      limit: storiesPageSize,
      order: '-fields.publishedDate',
    })
    const fireSideChats = await client.getEntries({
      content_type: 'firesideChat',
      limit: chatsPageSize,
      order: '-fields.publishedDate',
    })
    return {
      shownStories: successData.items,
      shownChats: fireSideChats.items,
    }
  },
  data() {
    return {
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
