<template>
  <div class="feature-container pt-0 px-16 pb-16">
    <img
      v-if="iconIsTopElement"
      class="icon"
      :src=iconUrl
    />
    <div class="heading2">
      {{ title }}
    </div>
    <img
      v-if="!iconIsTopElement"
      class="icon"
      :src=iconUrl
    />
    <div class="body1 my-16">
      {{ description }}
    </div>
    <nuxt-link class="button-link" :to="buttonLink">
      <el-button class="secondary" @click="sendGtmEvent">
        {{ buttonText }}
      </el-button>
    </nuxt-link>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

export default {
  name: 'PortalFeature',

  props: {
    feature: {
      type: Object,
      default: () => {}
    },
    iconIsTopElement: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    buttonLink() {
      return pathOr('', ['fields','buttonLink'], this.feature)
    },
    buttonText() {
      return pathOr('', ['fields','buttonText'], this.feature)
    },
    description() {
      return pathOr('', ['fields','description'], this.feature)
    },
    title() {
      return pathOr('', ['fields','title'], this.feature)
    },
    iconUrl() {
      return pathOr('', ['fields','icon', 'fields', 'file', 'url'], this.feature)
    }
  },

  methods: {
    sendGtmEvent(e) {
      this.$gtm.push({
        event: 'interaction_event',
        event_name: 'portal_feature_button_click',
        files: "",
        file_name: "",
        file_path: "",
        file_type: "",
        location: this.buttonText,
        category: this.title,
        dataset_id: "",
        version_id: "",
        doi: "",
        citation_type: ""
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.feature-container {
  border: 2px solid $grey;
  border-radius: .75rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.icon {
  max-width: 50%;
  margin: 0 auto;
}
.centered {
  text-align: center;
}
.body1 {
  text-align: left;
}
.button-link {
  margin-top: auto;
}
</style>
