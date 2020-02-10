<template>
  <div class="simulation-about-info">
   <div
      v-loading="loadingMarkdown"
      class="col-xs-12 description-container"
      v-html="parsedMarkdown"
    />
  </div>
</template>

<script>
export default {
  name: 'SimulationAboutInfo'
}
</script>

<style lang="scss" scoped>
.simulation-about-info {
    p {
        font-size: 1em;
        font-weight: normal;
        line-height: 24px;

    }
}
</style>
