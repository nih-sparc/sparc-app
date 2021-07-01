<template>
  <div class="subpage">
    <div v-for="(item, index) in stories" :key="index">
      <community-spotlight-item :story="item" />
      <div v-if="index !== stories.length - 1" class="seperator-path" />
    </div>
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.seperator-path {
  width: 971px;
  height: 2px;
  background: rgb(216, 216, 216);
  border-radius: 0px;
  margin-bottom: 32px;
}

.subpage {
  margin-bottom: 20px;
}
</style>
