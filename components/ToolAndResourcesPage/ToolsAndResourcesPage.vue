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
      <div class="subpage">
        <!-- eslint-disable vue/no-v-html -->
        <!-- marked will sanitize the HTML injected -->
        <slot />
        <div class="content" v-html="parseMarkdown(htmlContent)" />
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
  },
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.subpage {
  margin-bottom: 2rem;
}
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
</style>
