<template>
  <div class="story-result">
    <client-only placeholder="Loading video ...">
      <div class="plyr__video-embed video" id="player">
        <iframe
          class="video"
          :src="embeddedVideoSrc"
          allowfullscreen
          allowtransparency
          allow="autoplay"
          frameBorder="0"
        />
      </div>
    </client-only>
    <div class="story-text">
      <div class="story-title">
        {{ story.fields.storyTitle }}
      </div>
      <br />
      <div class="story-description">
        {{ story.fields.summary }}
      </div>
      <br />
      <nuxt-link
        :to="{
          name: 'news-and-events-community-spotlight-id',
          params: { id: story.fields.storyRoute, contentfulId: story.sys.id }
        }"
      >
        <el-button size="small" class="secondary-button">
          Learn More
        </el-button>
      </nuxt-link>
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
@import "@/assets/_variables.scss";

.video {
  height: 237px;
  width: 420px;
  flex: 1;
}

.story-result {
  display: flex;
  height: 272px;
  width: 100%;
}

.story-text {
  flex: 1.1;
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
