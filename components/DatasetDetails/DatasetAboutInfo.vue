<template>
  <div class="dataset-about-info">
    <div class="dataset-about-info__container">
      <h3>Last Updated</h3>
      <p>{{ lastUpdatedDate }}</p>
      <h3>Dataset DOI</h3>
      <p>{{ datasetDOI }}</p>
      <h3>Protocol DOIs</h3>
      <p>{{ protocolDOIs }}</p>
      <h3>Awards</h3>
      <p>{{ datasetAwards }}</p>
      <h3>Cite This Dataset</h3>
      <div class="dataset-about-info__container--citation">
        Citation goes here
      </div>
      <h3>Tags</h3>
      <ul>
        <li>
          Tag 1
        </li>
        <li>
          Tag 2
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatasetAboutInfo',
  props: {
    datasetDetails: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.dataset-about-info {
  &__container {
    h3 {
      font-size: 0.875em;
      font-weight: 500;
      line-height: 1em;
      color: black;
    }

    p {
      font-size: 0.875em;
      font-weight: normal;
      line-height: 24px;
      color: black;
      margin-bottom: 1.5rem;
    }

    &--citation {
      height: 6.5rem;
      background: $washed-gray;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-bottom: 1.5rem;
    }
  }
}
</style>
