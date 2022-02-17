<template>
  <div class="subpage mb-16">
    <div v-for="(item, index) in items" :key="index">
      <community-announcement-item :item="item" />
      <div v-if="index !== items.length - 1 || bottomLink" class="seperator-path my-32" />
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
import CommunityAnnouncementItem from './CommunityAnnouncementItem.vue'

export default {
  name: 'CommunityAnnouncementListings',
  components: {
    CommunityAnnouncementItem
  },
  props: {
    items: {
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
      default: 'View All Community Announcements'
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
