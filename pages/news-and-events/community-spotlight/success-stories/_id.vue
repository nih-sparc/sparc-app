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
            <div class="content" v-html="renderedStory" />
          </el-col>
          <el-col :sm="11">
            <template v-if="entry.youtubeUrl">
              <div class="plyr__video-embed banner-asset" id="player">
                <iframe
                  class="banner-asset"
                  :src="embeddedVideoSrc"
                  allowfullscreen
                  allowtransparency
                  allow="autoplay"
                  frameBorder="0"
                />
              </div>
            </template>
            <template v-else-if="entry.files">
              <img class="banner-asset" :src="entry.files[0].fields.file.url" :alt="entry.files[0].description"/>
            </template>
            <div class="seperator-path" />
            <div class="story-bold-field">
              Author
            </div>
            <div class="story-field">
              {{ entry.name }}
            </div>
            <br />
            <template v-if="entry.publishDate">
              <div class="story-bold-field">
                Published Date
              </div>
              <div class="story-field">
                {{ entry.publishDate }}
              </div>
              <br />
            </template>
            <template v-if="entry.teamMemberNames">
              <div class="story-bold-field">
                Team Members
              </div>
              <div
                v-for="(item, index) in entry.teamMemberNames"
                :key="'name' + index"
                class="story-field"
              >
                {{ item }}
                <template v-if="entry.teamMemberOrcidIds && entry.teamMemberOrcidIds.length - 1 > index">
                  ({{ entry.teamMemberOrcidIds[index] }})
                </template>
              </div>
              <br />
            </template>
            <template v-if="entry.references">
              <div class="story-bold-field">
                Supporting information
              </div>
              <div
                v-for="(item, index) in entry.references"
                :key="'reference' + index"
                class="story-field"
              >
                <a :href="item" target="_blank">{{ item }}</a>
              </div>
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
    </div>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { successMessage, failMessage } from '@/utils/notification-messages'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import DatasetCard from '@/components/DatasetCard/DatasetCard.vue'
import createClient from '@/plugins/contentful.js'
import youtubeEmbeddedSource from '@/mixins/youtube-embedded-src'


// options for rendering contentful rich text. Modified from:
// https://www.contentful.com/blog/2021/04/14/rendering-linked-assets-entries-in-contentful/
const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: node => {
      if (node.data.target.sys.contentType.sys.id === 'videoEmbed') {
        return `<iframe
            src="${youtubeEmbeddedSource(node.data.target.fields.embedUrl)}"
            height="285px"
            width="520px"
            frameBorder="0"
            scrolling="no"
            title="${node.data.target.fields.title}"
            allowFullScreen="true"
            allowtransparency="true"
          />`
      }
    },
    [BLOCKS.EMBEDDED_ASSET]: ({ data: { target: { fields }}}) =>
      `<img src="${fields.file.url}" height="${fields.file.details.image.height}" width="${fields.file.details.image.width}" alt="${fields.description}"/>`
  }
}

const client = createClient()

export default {
  name: 'StoryPage',
  components: {
    DatasetCard,
    Breadcrumb,
    PageHero
  },
  async asyncData({ route }) {
    try {
      const results = await client.getEntries({
        content_type: 'successStory',
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
        },
        {
          label: 'Success Stories',
          to: {
            name: 'news-and-events-community-spotlight-success-stories'
          }
        }
      ]
    }
  },
  computed: {
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    },
    renderedStory: function() {
      if (this.entry.story) {
        return documentToHtmlString(this.entry.story, options)
      }
      return ''
    },
    embeddedVideoSrc: function() {
      return youtubeEmbeddedSource(this.entry.youtubeUrl)
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
  width: 1068px;
}

.banner-asset {
  width: 100%;
  min-height: 250px;
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
</style>
