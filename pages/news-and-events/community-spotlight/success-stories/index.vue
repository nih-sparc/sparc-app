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
import Vue from 'vue';
//import { Route } from 'vue-router';
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
