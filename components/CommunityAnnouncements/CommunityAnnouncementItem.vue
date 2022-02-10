<template>
  <div class="story-result">
    <div class="banner">
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
          v-else-if="story.fields.image"
          class="banner-asset"
          :src="story.fields.image.fields.file.url"
          :alt="story.fields.image.description"
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
      <div class="story-title">
        {{ story.fields.title }}
      </div>
      <br />
      <div class="story-description">
        {{ story.fields.summary }}
      </div>
      <br />
      <nuxt-link
        v-if="story.fields.storyRoute"
        :to="{
          name: 'news-and-events-community-announcement-success-stories-id',
          params: { id: story.fields.storyRoute, contentfulId: story.sys.id }
        }"
      >
        <el-button size="small" class="secondary-button">
          Learn More
        </el-button>
      </nuxt-link>
      <a v-else-if="story.fields.youtubeUrl" :href="story.fields.youtubeUrl">
        <el-button size="small" class="secondary-button">
          Learn More
        </el-button>
      </a>
    </div>
  </div>
</template>
<script>
import youtubeEmbeddedSource from '@/mixins/youtube-embedded-src'

export default {
  name: 'CommunityAnnouncementItem',
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

.story-result {
  display: flex;
  flex-wrap: wrap;
  min-height: 138px;
  width: 100%;
}

.story-text {
  flex: 8;
  min-width: 17.5rem;
  @media (max-width: 48em) {
    margin: 1rem 0 0;
  }
}

.story-title {
  color: rgb(36, 36, 91);
  font-family: Asap;
  font-size: 22px;
  font-weight: 500;
  line-height: 32px;
}

.story-description {
  color: rgb(36, 36, 91);
  font-family: Asap;
  font-size: 18px;
  font-weight: normal;
  line-height: 24px;
}

.secondary-button {
  background: #f9f2fc;
  color: rgb(131, 0, 191);
  font-family: Asap;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid $median;
  color: $median;
  &:hover {
    color: #1a1489;
  }
}
</style>
