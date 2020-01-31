<template>
  <div class="events-page">
    <page-hero>
      <HelpSearchControls
        :search-on-load="true"
        submit-text="Go"
        @query="onSearchQuery"
      />
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <div class="header">
          <h2>{{ helpItem.fields.title }}</h2>
          <div class="summary">
            {{ helpItem.fields.summary }}
          </div>
          <div class="updated">
            <i>Updated at: {{ updateDate }} </i>
          </div>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <!-- marked will sanitize the HTML injected -->
        <div class="content" v-html="parseMarkdown(htmlContent)" />
      </div>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns'
import { pathOr } from 'ramda'

import HelpSearchControls from '@/components/help-search-controls/HelpSearchControls.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import MarkedMixin from '@/mixins/marked'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'EventPage',

  components: {
    HelpSearchControls,
    PageHero
  },

  mixins: [MarkedMixin],

  asyncData(env) {
    return Promise.all([client.getEntry(env.params.helpId)])
      .then(([helpItem]) => {
        return {
          helpItem: helpItem
        }
      })
      .catch(() => {
        throw Error
      })
  },

  computed: {
    /**
     * Compute HTML Content for the page
     * @returns {String}
     */
    htmlContent() {
      return pathOr('', ['fields', 'helpContent'], this.helpItem)
    },

    /**
     * Compute and convert the date the article was created
     * @returns {String}
     */
    updateDate: function() {
      return format(parseISO(this.helpItem.sys.updatedAt), 'MM/dd/yyyy')
    }
  },

  methods: {
    onSearchQuery: function() {
      return 0
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
    margin-bottom: 8px;
  }
  & ::v-deep img {
    width: 100%;
    margin: 5px 0;
  }
}

.header {
  margin-bottom: 3em;
  .updated {
    color: #aaa;
  }
}
</style>
