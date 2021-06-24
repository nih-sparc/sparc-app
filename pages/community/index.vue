<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="allHelpData.title" />
    <page-hero>
      <h1>Success Stories</h1>
      <br />
      <p>
        Learn how researchers have used the SPARC Program to advance neuromodulation of the ANS. Submit your success story
      </p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <div v-for="(item, index) in story" :key="index">
          <div class="story-result">
            <client-only placeholder="Loading video ...">
              <div class="plyr__video-embed video" id="player">
                <iframe
                  class="video"
                  :src="videoSrc"
                  allowfullscreen
                  allowtransparency
                  allow="autoplay"
                />
              </div>
            </client-only>
            <div class="story-text">
              <div class="story-title">
                {{ item.fields.storyTitle }}
              </div>
              <br />
              <div class="story-description">
                {{ item.fields.summary }}
              </div>
            </div>
          </div>
          <div v-if="index !== story.length - 1" class="seperator-path" />
        </div>
      </div>
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
import func from 'vue-editor-bridge';
import Plyr from 'plyr'

const client = createClient()

export default {
  name: 'CommunityPage',

  components: {
    Breadcrumb,
    PageHero
  },

  async asyncData() {
    const successData = await client.getEntries({
      content_type: 'successStory'
    })
    //window.successDatafasd = successData
    // const successData = await client.getEntry('1W2BabYIEBIMq12Pg2WAtB', {
    //   include: 2
    // })
    let vid = successData.items[0].fields.youtubeUrl
    let id = vid.split('=').pop()
    let embedUrl = 'https://www.youtube.com/embed/' + id
    console.log(successData)
    return {
      story: successData.items,
      videoSrc: `${embedUrl}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
    }
  },

  data() {
    return {
      allHelpData: {},
      story: {},
      videoSrc: '',
      isLoadingSearch: false,
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
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
.page-hero {
  background-color: #292b66;
  background-image: none;
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}
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
