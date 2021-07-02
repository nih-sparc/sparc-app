<template>
  <div class="events-page">
    <page-hero>
      <h1>{{ entry.storyTitle }}</h1>
      <br />
      <p>
        {{ entry.summary }}
      </p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <el-row :gutter="32">
          <el-col :sm="12">
            <div class="content" v-html="renderedStory" />
          </el-col>
          <el-col :sm="12">
            <div class="plyr__video-embed video" id="player">
              <iframe
                class="video"
                :src="embeddedVideoSrc"
                allowfullscreen
                allowtransparency
                allow="autoplay"
                frameBorder="0"
              />
            </div>
            <div class="seperator-path" />
            <div class="story-bold-field">
              Author
            </div>
            <div class="story-field">
              {{ entry.name }}
            </div>
            <br />
            <div class="story-bold-field">
              Published Date
            </div>
            <div class="story-field">
              {{ entry.publishDate }}
            </div>
            <br />
            <div class="story-bold-field">
              Team Members
            </div>
            <div
              v-for="(item, index) in entry.teamMemberNames"
              :key="index"
              class="story-field"
            >
              {{ item }} ({{ entry.teamMemberOrcidIds[index] }})
            </div>
            <br />
            <div class="story-bold-field">
              Supporting information
            </div>
            <div
              v-for="(item, index) in entry.references"
              :key="index"
              class="story-field"
            >
              {{ item }}
            </div>
            <br />
            <div class="story-bold-field">
              Share
            </div>
            <div class="share-links">
              <share-network
                network="facebook"
                :url="pageUrl"
                title="heroTitle"
              >
                <svg-icon name="icon-share-facebook" height="28" width="28" />
                <span class="visuallyhidden">Share on Facebook</span>
              </share-network>
              <share-network
                network="twitter"
                class="ml-8"
                :url="pageUrl"
                title="heroTitle"
              >
                <svg-icon name="icon-share-twitter" height="28" width="28" />
                <span class="visuallyhidden">Share on Twitter</span>
              </share-network>
              <share-network
                network="linkedin"
                class="ml-8"
                :url="pageUrl"
                title="heroTitle"
              >
                <svg-icon name="icon-share-linked" height="28" width="28" />
                <span class="visuallyhidden">Share on Linkedin</span>
              </share-network>
                <svg-icon name="icon-permalink" class="ml-8" height="28" width="28" />
                <span class="visuallyhidden">Copy permalink</span>
              </button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'
import youtubeEmbeddedSource from '@/mixins/youtube-embedded-src'

const client = createClient()

export default {
  name: 'StoryPage',
  components: {
    PageHero
  },
  async asyncData({ route }) {
    try {
      console.log('in id page!')
      console.log(route.params.id)
      console.log(route.params.contentfulId)
      const successStory = await client.getEntry(route.params.contentfulId)
      console.log(successStory)
      return {
        entry: successStory.fields,
        slug: route.params.slug
      }
    } catch (error) {
      return {
        page: {
          fields: []
        }
      }
    }
  },
  data: function() {
    return {
      entry: {},
      slug: '',
      pageUrl: 'https://sparc.science'
    }
  },
  computed: {
    renderedStory: function() {
      if (this.entry.story) {
        return documentToHtmlString(this.entry.story)
      }
      return ''
    },
    embeddedVideoSrc: function() {
      return youtubeEmbeddedSource(this.entry.youtubeUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.page-wrap {
  width: 1035px;
}

.video {
  width: 100%;
  height: 285px;
}

.content {
  & ::v-deep {
    color: $vestibular;
  }
  & ::v-deep p {
    margin-bottom: 1em;
  }
  & ::v-deep img {
    height: auto;
    margin: 0.5em 0;
    max-width: 100%;
  }
}

.seperator-path {
  width: 100%;
  height: 2px;
  background: rgb(216, 216, 216);
  border-radius: 0px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.story-bold-field {
  color: rgb(0, 0, 0);
  font-family: Asap;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.header {
  margin-bottom: 3em;
  .updated {
    color: #aaa;
  }
}
</style>
