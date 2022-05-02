<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="allHelpData.title" />
    <help-hero :title="allHelpData.title" :summary="allHelpData.summary" />
    <div v-loading="isLoadingSearch">
      <div v-if="readmeSearchResults.length > 0" class="page-wrap container">
        <div class="subpage">
          <h2>
            Readme Migration Results
            <sparc-tooltip placement="left-center">
              <div slot="data">As the SPARC consortium continues their migration<br />process to utilize <a href="https://docs.sparc.science/" target="_blank">readme.io</a> in an effort to better<br />organize documentation, the content of the<br /><b>Readme Migration Results</b> may be incomplete and/or<br />replicated in multiple categories below</div>
              <svg-icon slot="item" class="purple-fill" icon="icon-help" width="26" height="26" />
            </sparc-tooltip>
          </h2>
          <readme-doc
            v-for="doc in readmeSearchResults"
            :key="doc.id"
            :doc="doc"
          />
        </div>
      </div>
      <help-section
        v-for="item in helpData.sections"
        :key="item.sys.id"
        class="help-section"
        :section="item"
        :searchTerms="searchTerms"
      />
    </div>
  </div>
</template>

<script>

import createClient from '@/plugins/contentful.js'
import HelpSection from "@/components/HelpSection/HelpSection.vue";
import ReadmeDoc from "@/components/ReadmeDoc/ReadmeDoc.vue"
import HelpHero from "@/components/HelpHero/HelpHero.vue";
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import { searchQueryReplacements } from '../data/utils';
import { pathOr } from 'ramda'

const client = createClient()

export default {
  name: 'HelpPage',

  components: {
    Breadcrumb,
    HelpSection,
    ReadmeDoc,
    HelpHero
  },

  mounted: function() {
    this.doSearch(this.$route.query.search)
  },

  watch: {
    '$route.query.search': function() {
      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      this.doSearch(this.$route.query.search)
    }
  },

  data() {
    return {
      allHelpData: {},
      helpData: {},
      readmeSearchResults: [],
      isLoadingSearch: false,
      searchTerms: '',
      readmeTooltip: 'As the SPARC consortium continues their migration process to utilize <a :href="https://docs.sparc.science/" target="_blank">readme.io</a> in an effort to better organize documentation the <em>Readme Migration Results</em> may be incomplete and/or replicated in multiple categories below',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ]
    }
  },

  async asyncData() {
    const { fields } = await client.getEntry(process.env.ctf_support_page_id, { include: 2 })
    return {
      allHelpData: fields,
      helpData: {},
      isLoadingSearch: false,
      searchTerms: '',
    }
  },

  methods: {
    doSearch: async function(terms) {
      this.isLoadingSearch = true;
      this.searchTerms = terms;
      try {
        if (terms) {
          let query = terms.toLowerCase()
          Object.entries(searchQueryReplacements).forEach(([term, replacement]) => query = query.replace(term, replacement))
          const { items } = await client
            .getEntries({
              content_type: 'helpDocument',
              query
            })

          this.helpData = {
            ...this.allHelpData,
            sections: (this.allHelpData.sections ?? []).map(section => ({
              ...section,
              fields: {
                ...section.fields,
                helpDocuments: section.fields.helpDocuments
                  .filter(hd => items.find(r => r.sys.id === hd.sys.id))
              }
            }))
          }
          const response = await this.$axios.get(`${process.env.portal_api}/search-readme/${query}`)
          this.readmeSearchResults = pathOr([], ['data', 'results'], response)
        } else {
          this.helpData = this.allHelpData
          this.readmeSearchResults = []
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingSearch = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
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
.purple-fill {
  fill: $purple;
}
</style>
