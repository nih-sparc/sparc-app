<template>
  <div class="help-page">
    <page-hero justify="left">
      <h2>{{ helpData.title }}</h2>
      <p>
        {{ helpData.summary }}
      </p>
      <HelpSearchControls
        isClearSearchVisible
        :search-on-load="true"
        submit-text="Go"
        @query="onSearchQuery"
      />
    </page-hero>
    <div v-loading="isLoadingSearch">
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

<script lang="ts">
import Vue from 'vue';
import createClient from '@/plugins/contentful.js'
import {Data, HelpData, HelpDocument, Methods} from "./model";
import HelpSection from "@/components/HelpSection/HelpSection.vue";
import HelpSearchControls from "@/components/help-search-controls/HelpSearchControls.vue";
import PageHero from "@/components/PageHero/PageHero.vue";
import SearchForm from '@/components/SearchForm/SearchForm.vue'

const client = createClient()


export default Vue.extend<Data, Methods, never, never>({
  name: 'HelpPage',

  components: {
    HelpSection,
    HelpSearchControls,
    PageHero,
    SearchForm
  },

  asyncData() {
    return client.getEntry<HelpData>(process.env.ctf_support_page_id as string, { include: 2 })
      .then((resp) => {
        return {
          allHelpData: resp.fields,
          helpData: resp.fields
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      allHelpData: {},
      helpData: {},
      isLoadingSearch: false,
      searchTerms: '',
    }
  },

  methods: {
    onSearchQuery: function(this: Data, terms) {
      this.isLoadingSearch = true;
      this.searchTerms = terms;
      client
        .getEntries<HelpDocument>({
          content_type: 'helpDocument',
          query: terms
        })
        .then(resp => {
          this.helpData = {
            ...this.allHelpData,
            sections: (this.allHelpData.sections ?? []).map(section => ({
              ...section,
              fields: {
                ...section.fields,
                helpDocuments: section.fields.helpDocuments.filter(hd => resp.items.find(r => r.sys.id === hd.sys.id))
              }
            }))
          }
        })
        .catch(console.error)
        .finally(() => {
          this.isLoadingSearch = false;
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.page-hero {
  background-color: $navy;
  background-image: none;
}
</style>
