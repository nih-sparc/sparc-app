<template>
  <div class="container">
    <div class="heading2 subpage">
      Dataset does not exist anymore: <b>{{datasetName}}</b>
      <hr class="my-16"/>
      <div class="heading3">
        The dataset with the identifier: <b>{{ doiUrl }}</b> has been removed and is no longer available on the SPARC portal.
        <br/>
        Please refer to the <a href="https://docs.sparc.science/?redirect=%2Fv1.0%2Fdocs%2Fsparc-changes-to-published-datasets-policy" target="_blank">SPARC Changes to Published Datasets</a> Policy for its full bibliographic citation and its statement of unavailability. 
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
