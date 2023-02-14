<template>
  <div class="dataset-references">
    <div v-if="showPrimaryPublications">
      <div class="heading2 mb-8">
        Primary Publications for this Dataset
      </div>
      <div v-for="(item, index) in primaryPublications" :key="index">
        <apa-citation @doi-invalid="onDoiInvalid" class="mb-8" :doi="item.doi" />
      </div>
      <hr v-if="associatedPublications" />
    </div>
    <div v-if="showAssociatedPublications">
      <div class="heading2 mb-8">
        Associated Publications for this Dataset
      </div>
      <div v-for="(item, index) in associatedPublications" :key="index">
        <apa-citation @doi-invalid="onDoiInvalid" class="mb-8" :doi="item.doi" />
      </div>
      <hr v-if="preprints" />
    </div>
    <div v-if="showPreprints">
      <div class="heading2 mb-8">
        Preprints
      </div>
      <div v-for="(item, index) in preprints" :key="index">
        <apa-citation @doi-invalid="onDoiInvalid" class="mb-8" :doi="item.doi" />
      </div>
    </div>
  </div>
</template>

<script>

import DoiChecker from '@/mixins/doi-checker'
import ApaCitation from '@/components/DatasetCitations/ApaCitation'
import { isEmpty } from 'ramda'

const PREPRINT_DOI_LINKS = ['https://doi.org/10.1101/']

export default {
  name: 'DatasetReferences',
  components: {
    ApaCitation
  },
  mixins: [DoiChecker],
  props: {
    primaryPublications: {
      type: Array,
      default: () => []
    },
    associatedPublications: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    preprints: function() {
      let preprintPublications = []
      let allPublications = this.primaryPublications ? this.primaryPublications : []
      allPublications = this.associatedPublications ? allPublications.concat(this.associatedPublications) : allPublications
      allPublications.forEach(publication => {
        const publicationDoiLink = `https://doi.org/${publication.doi}`
        if(PREPRINT_DOI_LINKS.some(preprintDoiLink => publicationDoiLink.includes(preprintDoiLink))){
          preprintPublications.push(publication)
        }
      })
      return isEmpty(preprintPublications) ? undefined : preprintPublications
    }
  }
}
</script>

<style lang="scss" scoped>
.dataset-references {
  hr {
    margin-top: 1rem;
    border-top: none;
  }
}
</style>
