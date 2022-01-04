<template>
  <div class="dataset-citations-info">
    <div v-if="primaryPublications">
      <div class="heading2 mb-8">
        Primary Publications for this Dataset
      </div>
      <div v-for="(item, index) in primaryPublications" :key="index">
        <external-pub-link class="mb-8" :publication="item" />
      </div>
      <hr v-if="associatedPublications" />
    </div>
    <div v-if="associatedPublications">
      <div class="heading2 mb-8">
        Associated Publications for this Dataset
      </div>
      <div v-for="(item, index) in associatedPublications" :key="index">
        <external-pub-link class="mb-8" :publication="item" />
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
  hr {
    margin-top: 1rem;
    border-top: none;
  }
}
</style>
