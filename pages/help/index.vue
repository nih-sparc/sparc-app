<template>
  <div class="help-page">
    <page-hero>
      <h2>{{ helpData.title }}</h2>
      <p>
        {{ helpData.summary }}
      </p>
      <p>
        <!-- {{ heroCopy }} -->
      </p>
      <HelpSearchControls
        isClearSearchVisible
        :search-on-load="true"
        submit-text="Go"
        @query="onSearchQuery"
      />
    </page-hero>

    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" :gutter="32">
          <el-col :xs="24" :md="22" :lg="18">
            <div v-loading="isLoadingSearch">
              <help-section
                v-for="item in helpData.sections"
                :key="item.sys.id"
                class="help-section"
                :section="item"
              />
            </div>
          </el-col>
        </el-row>
      </div>
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

const client = createClient()


export default Vue.extend<Data, Methods, never, never>({
  name: 'HelpPage',

  components: {
    HelpSection,
    HelpSearchControls,
    PageHero
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
    }
  },

  methods: {
    onSearchQuery: function(this: Data, terms) {
      this.isLoadingSearch = true;
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
.help-section {
  margin: 0 0 2em;
}
</style>
