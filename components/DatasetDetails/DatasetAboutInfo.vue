<template>
  <div class="dataset-about-info">
    <div class="dataset-about-info__container">
      <h2 class="section-text">
        About this dataset
      </h2>
      <p><strong>Title: </strong>{{datasetTitle}}</p>
      <p><strong>First Published: </strong>{{firstPublishedDate}}</p>
      <p><strong>Last Published: </strong>{{latestVersionDate}}</p>
      <hr />
      <div class="about-section-container">
        <span class="author-section-name-column"><strong>Contact Author: </strong></span>
        <span>
          <div>{{datasetOwnerName}}</div>
          <div>
            <a
            :href="`mailto:${datasetOwnerEmail}`"
            >
              {{ datasetOwnerEmail }}
            </a>
          </div>
        </span> 
      </div>
      <hr />
      <p><strong>Award: </strong>NIH {{sparcAwardNumber}}</p>
      <hr />
      <p><strong>Associated project: </strong></p>
      <div class="about-section-container">
        <span class="institution-section-name-column"><strong>Institution(s): </strong></span>
        <span>
          
        </span> 
      </div>
      <hr />
      <h2 class="section-text">
        About this version
      </h2>
      <p><strong>{{versionRevisionText}}: </strong>Publication date: {{publicationDate}} (Last updated: {{lastPublishedDate}})</p>
      <p><strong>Dataset DOI: </strong>
        <a
            :href="doiLink"
            target="_blank"
          >
            {{ doiLink }}
          </a>
      </p>
    </div>
  </div>
</template>

<script>
import { compose, propOr, head } from 'ramda'
import { mapState } from 'vuex'

import DateUtils from '@/mixins/format-date'

export default {
  name: 'DatasetAboutInfo',

  components: {
  },
  props: {
    latestVersionRevision: {
      type: String,
      default: ''
    },
    latestVersionDate: {
      type: String,
      default: ''
    }
  },
  mixins: [DateUtils],
  data() {
    return {
      sparcAwardNumber: ''
    }
  },

  computed: {
    ...mapState('pages/datasets/datasetId', ['datasetInfo', 'datasetType']),
    /**
     * Returns the dataset title
     * @returns {String}
     */
    datasetTitle: function() {
      return propOr('', 'name', this.datasetInfo)
    },
    /**
     * Get formatted originally published date
     * @return {String}
     */
    firstPublishedDate: function() {
      const date = propOr('', 'firstPublishedAt', this.datasetInfo)
      return this.formatDate(date)
    },
    /**
     * Get formatted last updated date
     * @return {String}
     */
    lastPublishedDate: function() {
      const date =
        this.datasetInfo.revisedAt || this.datasetInfo.versionPublishedAt
      return this.formatDate(date)
    },
    /**
     * Get formatted publication date
     * @return {String}
     */
    publicationDate: function() {
      const date = this.datasetInfo.versionPublishedAt
      return this.formatDate(date)
    },
    /**
     * Returns dataset owner full name
     * @returns {String}
     */
    datasetOwnerName: function() {
      const ownerFirstName = this.datasetInfo.ownerFirstName || ''
      const ownerLastName = this.datasetInfo.ownerLastName || ''
      return `${ownerFirstName} ${ownerLastName}`
    },

    /**
     * Returns dataset owner email
     * @returns {String}
     */
    datasetOwnerEmail: function() {
      return this.datasetInfo.ownerEmail || ''
    },
    /**
     * Return DOI link
     * @returns {String}
     */
    doiLink: function() {
      const doi = propOr('', 'doi', this.datasetInfo)
      return doi ? `https://doi.org/${doi}` : ''
    },
    /**
     * computes the right text based on the version and revision
     * @returns {String}
     */
    versionRevisionText() {
      let revision = this.datasetInfo.revision ? this.datasetInfo.revision : '0'
      return `Version ${this.datasetInfo.version} Revision ${revision}`
    },
    /**
     * Gets the sparc award number
     * @return {String}
     */
    getSparcAwardNumber: function() {
      return this.sparcAwardNumber !== '' ? this.sparcAwardNumber : 'N/A'
    },

    /**
     * Url to get records for model
     * @returns {String}
     */
    getRecordsUrl: function() {
      return `${process.env.discover_api_host}/search/records?datasetId=${this.$route.params.datasetId}`
    },
  },

  watch: {
    getRecordsUrl: {
      handler: function(val) {
        if (val) {
          this.getDatasetRecords()
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * Retrievs the metadata records for a dataset to get the sparc award number
     */
    getDatasetRecords: async function() {
      try {
        const summary = await this.$axios
          .$get(`${this.getRecordsUrl}&model=summary`)
          .catch(
            // handle error
            (this.errorLoading = true)
          )
        const award = await this.$axios
          .$get(`${this.getRecordsUrl}&model=award`)
          .catch(
            // handle error
            (this.errorLoading = true)
          )

        const summaryId = compose(
          propOr('', 'hasAwardNumber'),
          propOr([], 'properties'),
          head,
          propOr([], 'records')
        )(summary)

        const awardId = compose(
          propOr('', 'award_id'),
          propOr([], 'properties'),
          head,
          propOr([], 'records')
        )(award)

        this.sparcAwardNumber = summaryId || awardId
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.dataset-about-info {
  .section-text {
    font-weight: 500;
  }
  hr {
    margin-top: 1rem;
    border-top: none;
  }
  a {
    text-decoration: underline;
  }
  .about-section-container {
    display: flex;
    @media (max-width: 48em) {
      flex-direction: column;
    }
    .author-section-name-column {
      min-width: 7.25rem;
    }
    .institution-section-name-column {
      min-width: 6rem;
    }
  }
}
</style>
