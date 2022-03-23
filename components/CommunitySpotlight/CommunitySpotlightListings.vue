<template>
  <div class="no-results" v-if="stories.length === 0">
    <el-table :show-header="false" empty-text="No Results">
      <el-table-column />
    </el-table>
  </div>
  <div v-else class="subpage mb-16">
    <div v-for="(item, index) in stories" :key="index">
      <community-spotlight-item :story="item" />
      <div v-if="index !== stories.length - 1 || bottomLink" class="seperator-path my-32" />
    </div>
    <nuxt-link
      v-if="bottomLink"
      class="link1 mt-16"
      :to="{
        name: linkLocation
      }"
    >
      {{ linkText }} &gt;
    </nuxt-link>
  </div>
</template>

<script>
import CommunitySpotlightItem from './CommunitySpotlightItem.vue'

export default {
  name: 'CommunitySpotlightListings',
  components: {
    CommunitySpotlightItem
  },
  props: {
    stories: {
      type: Array,
      default: () => []
    },
    bottomLink: {
      type: Boolean,
      default: false
    },
    linkLocation: {
      type: String,
      default: 'news-and-events-community-spotlight'
    },
    linkText: {
      type: String,
      default: 'View All Community Spotlights'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.seperator-path {
  width: 100%;
  height: 0.125rem;
  background: rgb(216, 216, 216);
  border-radius: 0px;
}
</style>
