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
    </div>
  </div>
</template>
<script>
const youtubeEmbedParams = '?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1'

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
      // parse the two ways of sharing links on youtube
      if (!this.story.fields.youtubeUrl) return ''
      if (this.story.fields.youtubeUrl.includes('watch')){
        let id = this.story.fields.youtubeUrl.split('=').pop()
        let embedUrl = 'https://www.youtube.com/embed/' + id + youtubeEmbedParams
        return embedUrl
      } else if (this.story.fields.youtubeUrl.includes('youtu.be')) {
        let id = this.story.fields.youtubeUrl.split('/').pop()
        let embedUrl = 'https://www.youtube.com/embed/' + id + youtubeEmbedParams
        return embedUrl
      } else {
        console.log("Error: can't parse youtube url")
        return ''
      }
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
</style>
