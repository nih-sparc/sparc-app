<template>
  <div class="project-details">
    <div class="project-details__page-route">
      <p>Teams and Projects > Comprehensive structural and functional...</p>
    </div>
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
@import '../../assets/_variables.scss';
.project-details {
  &__page-route {
    background: $purple-gray;
    height: 2.5rem;
    margin-top: 0;
    p {
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      padding-left: 2rem;
      padding-top: 0.75rem;
      margin-top: 0;
      color: $midnight;
    }
  }
}
@media screen and (max-width: 768px) {
  .project-details {
    &__page-route {
      height: 3.5rem;
    }
  }
}
</style>