<template>
  <div class="item-result">
    <div class="banner">
      <div class="banner-wrapper">
        <img
          v-if="item.fields.image"
          class="banner-asset"
          :src="item.fields.image.fields.file.url"
          :alt="item.fields.image.description"
        />
      </div>
    </div>
    <div class="item-text">
      <nuxt-link
        v-if="item.fields.requiresADetailsPage"
        :to="{
          name: 'news-and-events-news-id',
          params: { id: item.sys.id }
        }"
      >
        {{ item.fields.title }}
      </nuxt-link>
      <a
        v-else
        :href="item.fields.url"
        :target="isInternalLink('item.fields.url') ? '_self' : '_blank'"
      >
        {{ item.fields.title }}
      </a>
      <div v-if="item.fields.publishedDate" class="item-description">
        {{ formatDate(item.fields.publishedDate) }}
      </div>
      <div class="spacer mb-16" />
      <div class="body1">
        {{ item.fields.summary }}
      </div>
    </div>
  </div>
</template>
<script>
import youtubeEmbeddedSource from '@/mixins/youtube-embedded-src'
import FormatDate from '@/mixins/format-date'
import { isInternalLink } from '@/mixins/marked/index'

export default {
  name: 'CommunityAnnouncementItem',
  mixins: [FormatDate],
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    embeddedVideoSrc: function() {
      return youtubeEmbeddedSource(this.item.fields.youtubeUrl)
    }
  },
  methods: {
    isInternalLink
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.banner-wrapper {
  position: relative;
  padding-bottom: 80%; /* 16:9 */
  height: 0;
  min-width: 8rem;
}

.banner-wrapper .banner-asset {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.banner {
  flex: 1;
  @media (min-width: 48rem) {
    margin-right: 2rem;
  }
}

.item-result {
  display: flex;
  flex-wrap: wrap;
  min-height: 6em;
  width: 100%;
}

.item-text {
  flex: 8;
  min-width: 17.5rem;
  @media (max-width: 48em) {
    margin: 1rem 0 0;
  }
}
</style>
