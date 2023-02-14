<template>
  <div class="p-12 breadcrumb nav3">
    <div>
      <template v-for="item in breadcrumb">
        <nuxt-link :key="item.label" :to="item.to">
          {{ item.label }}
        </nuxt-link>
        >
      </template>
      <span v-html="parseMarkdown(title, { ALLOWED_TAGS: ['sup'] })"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Methods, Props } from './model'
import marked from '@/mixins/marked/index'

export default Vue.extend<never, Methods, never, Props>({
  name: 'Breadcrumb',

  mixins: [marked],

  props: {
    breadcrumb: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.breadcrumb {
  background: $lineColor2;
  height: fit-content;
  a {
    text-decoration: none;
    color: $darkBlue;
  }
  & sup {
    vertical-align: baseline;
    position: relative;
    top: -0.4em;
  }
}
</style>
