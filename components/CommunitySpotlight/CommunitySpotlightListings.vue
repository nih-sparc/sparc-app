<template>
  <div class="subpage">
    <div v-for="(item, index) in stories" :key="index">
      <community-spotlight-item :story="item" />
      <div v-if="index !== stories.length - 1 || bottomLink" class="seperator-path" />
    </div>
    <nuxt-link
      v-if="bottomLink"
      class="community-link mt-16"
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
  height: 2px;
  background: rgb(216, 216, 216);
  border-radius: 0px;
  margin-bottom: 32px;
  margin-top: 32px;
}

.subpage {
  margin-bottom: 20px;
}

.community-link {
  background: none;
  border: none;
  color: $navy;
  cursor: pointer;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  padding: 0;
  &:hover,
  &:active {
    text-decoration: underline;
  }
}
</style>
