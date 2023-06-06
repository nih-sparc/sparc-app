<template>
  <div class="learn-more-card">
    <a class="link1" :href="aboutDetailsItem.fields.link"
      v-html="aboutDetailsItem.fields ? highlightMatches(aboutDetailsItem.fields.title, $route.query.search) : ''"
    />
    <p
      v-html="aboutDetailsItem.fields ? highlightMatches(aboutDetailsItem.fields.description, $route.query.search) : ''"
    />
  </div>
</template>

<script>
import { highlightMatches } from '../../pages/data/utils'

export default {
  name: 'LearnMoreCard',

  props: {
    aboutDetailsItem: {
      type: Object,
      default: () => {
        return {
          sys: {},
          fields: {}
        }
      }
    }
  },

  methods: {
    highlightMatches
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.learn-more-card {
  h3 {
    font-size: 24px;
    font-weight: 300;
    line-height: 1.2;
    margin-bottom: .5rem;
  }
}
.small-title {
  h3 {
    font-size: 1em !important;
  }
}

.link1:not(:hover) {
  text-decoration: none;
}
</style>
