<template>
  <div class="dataset-citations-info">
    <div v-if="primaryPublications">
      <h2 class="section-text">
        Primary Publications for this Dataset
      </h2>
      <div v-for="(item, index) in primaryPublications" :key="index">
        <external-pub-link :publication="item" />
      </div>
      <hr v-if="associatedPublications" />
    </div>
    <div v-if="associatedPublications">
      <h2 class="section-text">
        Associated Publications for this Dataset
      </h2>
      <div v-for="(item, index) in associatedPublications" :key="index">
        <external-pub-link :publication="item" />
      </div>
    </div>
  </div>
</template>

<script>

import ExternalPubLink from '@/components/ExternalPubLink/ExternalPubLink'

export default {
  name: 'DatasetCitationsInfo',

  components: {
    ExternalPubLink
  },
  props: {
    primaryPublications: {
      type: Array,
      default: []
    },
    associatedPublications: {
      type: Array,
      default: []
    },
  },
}
</script>

<style lang="scss" scoped>
.dataset-citations-info {
  .section-text {
    font-weight: 500;
  }
  hr {
    margin-top: 1rem;
    border-top: none;
  }
}
</style>
