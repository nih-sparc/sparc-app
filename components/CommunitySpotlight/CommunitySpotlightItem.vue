<template>
  <div class="story-result">
    <div>
      <div class="banner-wrapper">
        <client-only
          v-if="story.fields.youtubeUrl"
          placeholder="Loading video ..."
        >
          <iframe
            class="banner-asset"
            :src="embeddedVideoSrc"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            frameBorder="0"
          />
        </client-only>
        <img
          v-else-if="story.fields.files && story.fields.files[0].fields.file.contentType.includes('image')"
          class="banner-asset"
          :src="story.fields.files[0].fields.file.url"
          :alt="story.fields.files[0].description"
        />
        <video
          v-else-if="story.fields.files && story.fields.files[0].fields.file.contentType.includes('video')"
          class="banner-asset"
          controls=""
          autoplay="false"
          name="media"
        >
          <source :src="story.fields.files[0].fields.file.url" :type="story.fields.files[0].fields.file.contentType">
        </video>
      </div>
    </div>
    <div class="story-text">
      <div class="link1 mb-8">
        <nuxt-link
          v-if="story.fields.storyRoute"
          :to="{
            name: 'news-and-events-community-spotlight-success-stories-id',
            params: { id: story.fields.storyRoute, contentfulId: story.sys.id }
          }"
        >
          {{ story.fields.storyTitle }}
        </nuxt-link>
        <a v-else-if="story.fields.youtubeUrl" :href="story.fields.youtubeUrl">
          {{ story.fields.storyTitle }}
        </a>
      </div>
      <div class="body1">
        {{ story.fields.summary }}
      </div>
    </div>
  </div>
</template>
<script>
import youtubeEmbeddedSource from '@/mixins/youtube-embedded-src'

export default {
  name: 'CommunitySpotlightItem',
  props: {
    story: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    embeddedVideoSrc: function() {
      return youtubeEmbeddedSource(this.story.fields.youtubeUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.banner-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  width: 12rem;
}

.banner-wrapper .banner-asset {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
}

.story-result {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  min-height: 10.875rem;
  width: 100%;
}

.story-text {
  flex: 1.2;
  min-width: 17.5rem;
  @media (max-width: 48em) {
    margin: 1rem 0 0;
  }
}
</style>
