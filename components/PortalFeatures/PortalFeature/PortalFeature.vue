<template>
  <div class="feature-container p-16">
    <img
      class="icon"
      :src=iconUrl
    />
    <div class="heading2">
      {{ title }}
    </div>
    <div class="body1 my-16">
      {{ description }}
    </div>
    <a :href="buttonLink">
      <el-button class="secondary">
        {{ buttonText }}
      </el-button>
    </a>
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
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.feature-container {
  border: 2px solid $grey;
  border-radius: .75rem;
}
.icon {
  max-width: 25%;
}
.centered {
  text-align: center;
}
.body1 {
  text-align: left;
}
</style>
