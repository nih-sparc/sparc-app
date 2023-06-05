<template>
  <div class="section-container container py-32">
    <div class="heading2 mb-32">{{ title }}</div>
    <div class="row">
      <div 
        v-for="(item, index) in features"
        :key="index"
        class="col"
        :style="`width: ${featureWidth}%`"
      >
        <portal-feature
          :feature="item"
          :icon-is-top-element="iconIsTopElement"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PortalFeature from './PortalFeature/PortalFeature.vue'

export default {
  name: 'PortalFeatures',
  components: {
    PortalFeature
  },
  props: {
    features: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "What Can I Do with SPARC?"
    },
    iconIsTopElement: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    featureWidth() {
      // Use 90 so that 10% of the width can be used for spacing between columns
      return 90.0 / this.features.length
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.section-container {
  text-align: center;
}
.col {
  display: flex;
  @media screen and (max-width: 767px) {
    width: 100% !important;
    margin-bottom: 1rem;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
}
</style>
