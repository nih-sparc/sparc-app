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
            <div class="share-links">
              <share-network
                network="facebook"
                :url="pageUrl"
                :title="page.fields.title"
                :description="page.fields.summary"
              >
                <svg-icon name="icon-share-facebook" height="28" width="28" />
                <span class="visuallyhidden">Share on Facebook</span>
              </share-network>
              <share-network
                network="twitter"
                class="ml-8"
                :url="pageUrl"
                :title="page.fields.title"
              >
                <svg-icon name="icon-share-twitter" height="28" width="28" />
                <span class="visuallyhidden">Share on Twitter</span>
              </share-network>
              <share-network
                network="linkedin"
                class="ml-8"
                :url="pageUrl"
                :title="page.fields.title"
              >
                <svg-icon name="icon-share-linked" height="28" width="28" />
                <span class="visuallyhidden">Share on Linkedin</span>
              </share-network>
            </div>
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
import MarkedMixin from '@/mixins/marked'
import FormatDate from '@/mixins/format-date'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PageHero from '@/components/PageHero/PageHero'

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
    },
    breadcrumb: {
      type: Array,
      default: () => {
        return []
      }
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
  & ::v-deep img,
  & ::v-deep video {
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
.share-links {
  display: flex;
}
</style>
