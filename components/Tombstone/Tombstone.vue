<template>
  <div class="container">
    <div class="heading2 subpage">
      Dataset does not exist anymore: <b>{{datasetName}}</b>
      <hr class="my-16"/>
      <div class="heading3">
        The dataset with the identifier: <b>{{ doiUrl }}</b> has been removed and is no longer available on the SPARC portal.
        <br/>
        Please refer to the <a href="https://docs.sparc.science/docs/list-of-datasets-that-have-been-removed" target="_blank">List of SPARC Datasets Removed from the SPARC Portal</a>
        for its full bibliographic citation and its statement of unavailability. For information on SPARC's policy on dataset removal, please refer to the Removal of Published Data section of the <a href="https://docs.sparc.science/docs/sparc-changes-to-published-datasets-policy" target="_blank">SPARC Changes to Published Datasets Policy</a>.
      </div>
    </div>
  </div>
</template>

<script>

import { propOr } from 'ramda'

export default {
  name: 'Tombstone',
  props: {
    datasetDetails: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    datasetName: function() {
      return propOr('', 'name', this.datasetDetails)
    },
    doiUrl: function() {
      return `https://doi.org/${this.doi}`
    },
    doi: function() {
      return this.datasetDetails.doi
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
hr {
  border-top: none;
  border-color: $lineColor1;
}
</style>
