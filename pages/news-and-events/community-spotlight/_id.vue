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
      slug: ''
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
  height: 300px;
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

.header {
  margin-bottom: 3em;
  .updated {
    color: #aaa;
  }
}
</style>
