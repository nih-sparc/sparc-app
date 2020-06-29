<template>
  <div class="help-card">
    <h3>
      <nuxt-link class="help-link"
        :to="{ name: 'help-helpId', params: { helpId: helpItem.sys.id } }"
      >
        {{ helpItem.fields.title || '' }}
      </nuxt-link>
    </h3>
    <p v-html="highlightText(searchTerms, helpItem.fields.summary || '')" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {HelpDocument} from "~/pages/help/model";

import HighlightText from '@/mixins/highlight-text'

export default Vue.extend<never, never, never, { helpItem: HelpDocument, searchTerms: string }>({
  name: 'HelpCard',

  mixins: [
    HighlightText
  ],

  props: {
    helpItem: {
      type: Object,
      default: () => {
        return {
          sys: {},
          fields: {}
        } as HelpDocument
      }
    },
    searchTerms: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.help-card {
  h3 {
    margin-bottom: 0;
  }
}
.help-link {
  color: $median;
  font-size: 24px;
}
.help-link:not(:hover) {
  text-decoration: none;
}
</style>
