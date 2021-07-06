<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Community Spotlight" />
    <page-hero>
      <h1>Community Spotlight</h1>
      <br />
      <p>
        Here about how the SPARC community are using the SPARC portal, including
        Success Stories and Fireside Chats. Also, keep up to date with Community Announcements.
      </p>
    </page-hero>
    <div class="page-wrap container">
      <community-spotlight-listings :stories="stories" />
    </div>
    <div class="pagination">
      <el-pagination
        :page-size="3"
        :total="10"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { Route } from 'vue-router';
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
    const successData = await client.getEntries({
      content_type: 'successStory'
    })
    return {
      stories: successData.items
    }
  },

  data() {
    return {
      stories: [],
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

  mounted: function(){
    // this.player = new Plyr(document.getElementById('player'))
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

.pagination {
  text-align: center;
}

::v-deep h2 {
  font-size: 1.5em;
  font-weight: 500;
  line-height: 2rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 2rem;
  }
}
</style>
