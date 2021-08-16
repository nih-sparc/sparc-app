<template>
  <div class="events-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ title }}</h1>
      <br />
      <p>
        {{ entry.summary }}
      </p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <el-row :gutter="38">
          <el-col :sm="13">
            <div class="content" v-html="parseMarkdown(entry.story)" />
          </el-col>
          <el-col :sm="11">
            <div class="banner-wrapper">
              <iframe
                v-if="entry.youtubeUrl"
                class="banner-asset"
                :src="embeddedVideoSrc"
                allowfullscreen
                allowtransparency
                allow="autoplay"
                frameBorder="0"
              />
              <img
                v-else-if="entry.files"
                class="banner-asset"
                :src="entry.files[0].fields.file.url"
                :alt="entry.files[0].description"
              />
            </div>
            <div class="seperator-path" />
            <div class="story-bold-field">
              Author
            </div>
            <div class="story-field">
              {{ author }}
            </div>
            <br />
            <template v-if="entry.publishDate">
              <div class="story-bold-field">
                Published Date
              </div>
              <div class="story-field">
                {{ formatDate(entry.publishDate) }}
              </div>
              <br />
            </template>
            <template v-if="entry.contributorsMarkdown">
              <div class="story-bold-field">
                Team Members
              </div>
              <div class="content story-field" v-html="parseMarkdown(entry.contributorsMarkdown)" />
              <br />
            </template>
            <template v-if="entry.referencesMarkdown">
              <div class="story-bold-field">
                Supporting information
              </div>
              <div class="content story-field" v-html="parseMarkdown(entry.referencesMarkdown)" />
              <br />
            </template>
            <div class="story-bold-field">
              Share
            </div>
            <div class="share-links">
              <share-network
                network="facebook"
                :url="pageUrl"
                :title="title"
              >
                <svg-icon name="icon-share-facebook" height="28" width="28" />
                <span class="visuallyhidden">Share on Facebook</span>
              </share-network>
              <share-network
                network="twitter"
                class="ml-8"
                :url="pageUrl"
                :title="title"
              >
                <svg-icon name="icon-share-twitter" height="28" width="28" />
                <span class="visuallyhidden">Share on Twitter</span>
              </share-network>
              <share-network
                network="linkedin"
                class="ml-8"
                :url="pageUrl"
                :title="title"
              >
                <svg-icon name="icon-share-linked" height="28" width="28" />
                <span class="visuallyhidden">Share on Linkedin</span>
              </share-network>
              <button class="ml-8 btn-copy-permalink" @click="copyLink">
                <svg-icon name="icon-permalink" height="28" width="28" />
                <span class="visuallyhidden">Copy permalink</span>
              </button>
            </div>
            <div class="seperator-path" />
            <template v-if="entry.associatedDatasets">
              <div class="story-bold-field">
                Associated Datasets
              </div>
              <br />
              <div
                v-for="(datasetUrl, index) in entry.associatedDatasets"
                :key="'dataset' + index"
                class="story-field"
              >
                <dataset-card :id="datasetIdFromUrl(datasetUrl)" />
              </div>
            </template>
          </el-col>
        </el-row>
      </div>
      <nuxt-link
        class="community-link mt-16"
        :to="{
          name: 'news-and-events-community-spotlight'
        }"
      >
        View All Community Spotlights &gt;
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { successMessage, failMessage } from '@/utils/notification-messages'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import DatasetCard from '@/components/DatasetCard/DatasetCard.vue'
import createClient from '@/plugins/contentful.js'
import youtubeEmbeddedSource from '@/mixins/youtube-embedded-src'
import MarkedMixin from '@/mixins/marked'
import FormatDate from '@/mixins/format-date'

const client = createClient()

export default {
  name: 'StoryPage',
  components: {
    DatasetCard,
    Breadcrumb,
    PageHero
  },
  mixins: [FormatDate, MarkedMixin],
  async asyncData({ route }) {
    try {
      const results = await client.getEntries({
        content_type: 'successStoryDisplay',
        'fields.storyRoute[match]': route.params.id,
        include: 1,
      })
      return {
        entry: results.items[0].fields,
        slug: route.params.slug,
        title: results.items[0].fields.storyTitle
      }
    } catch (error) {
      return {
        title: '',
        entry: {},
        slug: ''
      }
    }
  },
  data: function() {
    return {
      title: '',
      entry: {},
      slug: '',
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
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    },
    embeddedVideoSrc: function() {
      return youtubeEmbeddedSource(this.entry.youtubeUrl)
    },
    author: function(){
      if (this.entry.name) return this.entry.name
      if (this.entry.author) return this.entry.author
      else return ''
    }
  },
  methods: {
    // Retrieve dataset id form sparc.science, discover.pennsieve, or just the id
    datasetIdFromUrl: function(url) {
      if (!url.includes('/')) return Number(url)
      let datasetId = url.split('/').pop()
      if (datasetId.includes('?')) datasetId = datasetId.split('?')[0]
      return Number(datasetId)
    },
    copyLink: function() {
      this.$copyText(this.pageUrl).then(
        () => {
          this.$message(successMessage('Share link copied to clipboard.'))
        },
        () => {
          this.$message(failMessage('Failed to copy share link.'))
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.page-wrap {
  max-width: 66.75rem;
  @media (max-width: 48em) {
    width: auto;
  }
}

.banner-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}

.banner-wrapper .banner-asset {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.iframe-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  min-width: 25.68rem;
}

// Used for sizing iframes that are in the content

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
  & ::v-deep iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  & ::v-deep video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  @media (max-width: 48em) {
    margin-bottom: 2rem;
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

.story-field {
  font-family: Asap;
  font-size: 14px;
  line-height: 24px;
}

.btn-copy-permalink {
  border: none;
  background: none;
  color: $median;
  cursor: pointer;
  padding: 0;
  &:active {
    outline: none;
  }
}

.header {
  margin-bottom: 3em;
  .updated {
    color: #aaa;
  }
}

.community-link {
  background: none;
  border: none;
  color: $navy;
  cursor: pointer;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  padding: 0;
  &:hover,
  &:active {
    text-decoration: underline;
  }
}
</style>
