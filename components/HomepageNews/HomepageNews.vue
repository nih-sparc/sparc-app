<template>
  <div class="featured-datasets container">
    <div class="home-container">
      <h2><a href="#">News &amp; Upcoming Events</a></h2>
      <sparc-card
        v-for="(item, idx) in news"
        :key="item.sys.id"
        :image="getImageSrc(item)"
        :image-alt="getImageAlt(item)"
        :image-align="idx % 2 ? 'right' : ''"
      >
        <div>
          <h3>
            <a :href="item.fields.url" target="_blank">
              {{ item.fields.title }}
            </a>
          </h3>
          <!-- eslint-disable vue/no-v-html -->
          <!-- marked will sanitize the HTML injected -->
          <div v-html="parseMarkdown(item.fields.summary)" />
        </div>
        <a :href="item.fields.url" target="_blank">
          <el-button size="medium">
            Learn More
          </el-button>
        </a>
      </sparc-card>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import SparcCard from '@/components/SparcCard/SparcCard.vue'

import MarkedMixin from '@/mixins/marked'

export default {
  name: 'HomepageNews',

  components: {
    SparcCard
  },

  mixins: [MarkedMixin],

  props: {
    news: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    /**
     * Get image source
     * @param {Object} item
     * @returns {String}
     */
    getImageSrc: function(item) {
      return pathOr('', ['fields', 'image', 'fields', 'file', 'url'], item)
    },
    /**
     * Get image source
     * @param {Object} item
     * @returns {String}
     */
    getImageAlt: function(item) {
      return pathOr(
        '',
        ['fields', 'image', 'fields', 'file', 'description'],
        item
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.home-container {
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}
h2 a:not(:hover) {
  color: #000;
  text-decoration: none;
}
.sparc-card {
  margin-bottom: 24px;
  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
  h3 {
    font-size: 1.333333333em;
  }
}
</style>
