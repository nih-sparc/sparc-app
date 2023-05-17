<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" :title="heroTitle" />
    <page-hero>
      <h1>{{ heroTitle }}</h1>
      <p>
        {{ heroSummary }}
      </p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage mb-32">
        <!-- eslint-disable vue/no-v-html -->
        <!-- marked will sanitize the HTML injected -->
        <slot />
        <div class="content" v-html="parseMarkdown(htmlContent)" />
        <hr v-if="hasTutorial || hasWebinar" class="my-24"/>
        <div class="mb-16" v-if="hasTutorial">
          <div class="label4 mb-4" >
            TUTORIALS & GUIDES
          </div>
          <a class="resource-link" v-for="(tutorial, index) in tutorials" :key="index" :href="tutorial.fields.url" :target="!opensInNewTab(tutorial.fields.url) ? '_self' : '_blank'">
            {{ tutorial.fields.title }}
            <svg-icon v-if="!isInternalLink(tutorial.fields.url)" name="icon-open" height="25" width="25" />
          </a>
        </div>
        <div v-if="hasWebinar">
          <div class="label4 mb-4" >
            VIDEOS & WEBINARS
          </div>
          <a class="resource-link" v-for="(webinar, index) in webinars" :key="index" :href="webinar.fields.url" :target="!opensInNewTab(webinar.fields.url) ? '_self' : '_blank'">
            {{ webinar.fields.title }}
            <svg-icon v-if="!isInternalLink(webinar.fields.url)" name="icon-open" height="25" width="25" />
          </a>
        </div>
      </div>
      <nuxt-link class="back-link" to="/resources/biological">
        View All Tools & Resources >
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import MarkedMixin from '@/mixins/marked'
import FormatDate from '@/mixins/format-date'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PageHero from '@/components/PageHero/PageHero'
import { pathOr } from 'ramda'
import { isInternalLink, opensInNewTab } from '@/mixins/marked/index'

export default {
  name: 'ToolsAndResourcesPage',

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
    heroTitle: {
      type: String,
      default: ''
    },
    heroSummary: {
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

  methods: {
    isInternalLink,
    opensInNewTab
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
     * Construct current url 
     * @returns {String}
     */
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    },
    tutorials: function() {
      return pathOr(null, ['fields', 'tutorials'], this.page)
    },
    hasTutorial: function() {
      return this.tutorials != null
    },
    webinars: function() {
      return pathOr(null, ['fields', 'webinars'], this.page)
    },
    hasWebinar: function() {
      return this.webinars != null
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.content {
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
.back-link {
  color: $darkBlue;
  font-weight: 700;
}
hr {
  border-top: none;
  border-left: none;
  border-right: none;
}
.resource-link {
  display: block;
  text-decoration: underline;
}
</style>
