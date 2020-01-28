<template>
  <div class="project-details">
    <details-header />
    <details-tabs />
  </div>
</template>

<script>
import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailsTabs from '@/components/DetailsTabs/DetailsTabs.vue'
export default {
  name: 'ProjectDetails',
  components: {
    DetailsHeader,
    DetailsTabs
  }
}
</script>

<style lang="scss" scoped>
</style>