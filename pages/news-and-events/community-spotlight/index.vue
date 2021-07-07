<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Community Spotlight" />
    <page-hero>
      <h1>Community Spotlight</h1>
      <br />
      <p>
        Hear about how the SPARC community are using the SPARC portal, including
        Success Stories and Fireside Chats. Also, keep up to date with Community Announcements.
      </p>
    </page-hero>
    <div class="page-wrap container">
      <community-spotlight-listings :stories="shownStories" />
    </div>
    <pagination
      v-if="allStories.length > pageSize"
      :page-size="pageSize"
      :total-count="allStories.length"
      layout="prev, pager, next"
      @select-page="pageChange"
    />
  </div>
</template>

<script>
import createClient from '@/plugins/contentful.js'
import PageHero from '@/components/PageHero/PageHero.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import CommunitySpotlightListings from '@/components/CommunitySpotlight/CommunitySpotlightListings.vue'

const client = createClient()

export default {
  name: 'CommunityPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunitySpotlightListings,
    Pagination
  },

  async asyncData() {
    const successData = await client.getEntries({
      content_type: 'successStory'
    })
    return {
      allStories: successData.items
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
.video {
  height: 237px;
  width: 420px;
  flex: 1;
}

.story-result {
  display: flex;
  height: 272px;
  width: 100%;
}

.story-text {
  flex: 1.1;
}

.story-title {
  color: rgb(36, 36, 91);
  font-family: Asap;
  font-size: 22px;
  font-weight: 500;
  line-height: 32px;
}

.story-description {
  color: rgb(36, 36, 91);
  font-family: Asap;
  font-size: 18px;
  font-weight: normal;
  line-height: 24px;
}

.seperator-path {
  width: 971px;
  height: 2px;
  background: rgb(216, 216, 216);
  border-radius: 0px;
  margin-bottom: 32px;
}

.page-wrap {
  width: 1035px;
}

.subpage{
  margin-bottom: 20px;
}
</style>
