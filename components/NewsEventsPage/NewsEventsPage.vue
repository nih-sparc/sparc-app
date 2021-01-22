<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" :title="page.fields.title" />
    <page-hero>
      <h1>{{ page.fields.title }}</h1>
      <p>
        {{ page.fields.summary }}
      </p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <!-- eslint-disable vue/no-v-html -->
        <!-- marked will sanitize the HTML injected -->
        <el-row :gutter="32">
          <el-col :xs="24" :sm="{ span: 12, push: 12 }" class="details">
            <slot />

            <h3>Share</h3>
            <share-network
              class="btn-share"
              network="facebook"
              tag="button"
              :url="pageUrl"
              :title="page.fields.title"
              :description="page.fields.summary"
            >
              Share on Facebook
            </share-network>
            <share-network
              class="btn-share"
              network="twitter"
              tag="button"
              :url="pageUrl"
              :title="page.fields.title"
            >
              Share on Twitter
            </share-network>
            <share-network
              class="btn-share"
              network="linkedin"
              tag="button"
              :url="pageUrl"
              :title="page.fields.title"
            >
              Share on LinkedIn
            </share-network>
          </el-col>
          <el-col :xs="24" :sm="{ span: 12, pull: 12 }">
            <div class="content" v-html="parseMarkdown(htmlContent)" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import MarkedMixin from '@/mixins/marked'
import FormatDate from '@/mixins/format-date'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PageHero from '@/components/PageHero/PageHero'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'NewsEventsPage',

  components: {
    Breadcrumb,
    PageHero
  },

  mixins: [FormatDate, MarkedMixin],

  props: {
    page: {
      type: Object,
      default: () => {
        return {}
      }
    },
    content: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
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
    /**
     * Compute HTML Content for the page
     * @returns {String}
     */
    htmlContent() {
      return this.content || ''
    },

    /**
     * Compute the full URL of the page
     * @returns {String}
     */
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

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
.details ::v-deep {
  font-size: 0.875rem;
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5rem;
    text-transform: uppercase;
  }
  img {
    height: auto;
    max-width: 100%;
  }
}
.btn-share {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
</style>
