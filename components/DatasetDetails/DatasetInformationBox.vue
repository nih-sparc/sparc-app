<template>
  <div class="dataset-information-box">
    <p><strong>Viewing version: {{versionRevisionText}}</strong></p>
    <p>
      DOI: 
      <a
        :href="doiLink"
      >
        <u>{{doi}}</u>
      </a>
    </p>
    <p>
      {{lastUpdatedDate}}
    </p>
    <div class="header-stats-block">
      <svg-icon class="mr-8" name="icon-files" height="20" width="20" />
      <div>
        <template v-if="datasetFiles > 0">
          <strong>
            {{ datasetFiles }}
          </strong>
          Files
        </template>
        <template v-else>
          No Files
        </template>
      </div>
    </div>
    <div class="header-stats-block" v-if="datasetTypeName === 'dataset'">
      <svg-icon
        class="mr-8"
        name="icon-storage"
        height="20"
        width="20"
      />
      <div>
        <strong>{{ datasetStorage.number }}</strong>
        {{ datasetStorage.unit }}
      </div>
    </div>
    <p><strong>Latest version: {{latestVersionRevision}}</strong></p>
    <p>{{latestVersionDate}}</p>
    <p v-if="!embargoed" v-on:click="viewOtherVersionsClicked" class="active-link">View other versions</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { propOr, compose, split } from 'ramda'

import FormatStorage from '@/mixins/bf-storage-metrics'
import DateUtils from '@/mixins/format-date'

export default {
  name: 'DatasetInformationBox',

  components: {
  },

  mixins: [DateUtils, FormatStorage],

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

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo', 'datasetTypeName','showAllVersionsModal']),
    /**
     * Gets dataset version
     * @returns {Number}
     */
    version: function() {
      return propOr(1, 'version', this.datasetInfo)
    },
        /**
     * Gets dataset size for download
     * @returns {Number}
     */
    downloadSize: function() {
      return propOr(0, 'size', this.datasetInfo)
    },
    /**
     * Returns the dataset storage count
     * @returns {Object}
     */
    datasetStorage: function() {
      if (this.embargoed) {
        return 'To be confirmed'
      }
      const storage = compose(
        split(' '),
        this.formatMetric,
        propOr(0, 'size')
      )(this.datasetInfo)

      return storage.reduce((number, unit) => {
        return {
          number,
          unit
        }
      })
    },
    /**
     * Returns the files associated with the dataset
     * @returns {String}
     */
    datasetFiles: function() {
      if (this.embargoed) {
        return 'To be confirmed'
      }
      return propOr('', 'fileCount', this.datasetInfo)
    },
    /**
     * Get the dataset DOI and return the url
     * @returns {String}
     */
    doi: function() {
      return propOr('', 'doi', this.datasetInfo)
    },
    embargoed: function() {
      return propOr(false, 'embargo', this.datasetInfo)
    },
    /**
     * Get formatted originally published date
     * @return {String}
     */
    originallyPublishedDate: function() {
      const date = propOr('', 'firstPublishedAt', this.datasetInfo)
      return this.formatDate(date)
    },
    /**
     * Get formatted last updated date
     * @return {String}
     */
    lastUpdatedDate: function() {
      const date =
        this.datasetInfo.revisedAt || this.datasetInfo.versionPublishedAt
      return this.formatDate(date)
    },
    /**
     * Return DOI link
     * @returns {String}
     */
    doiLink: function() {
      return this.doi ? `https://doi.org/${this.doi}` : ''
    },
    /**
     * computes the right text based on the version and revision
     * @returns {String}
     */
    versionRevisionText() {
      let revision = this.datasetInfo.revision ? this.datasetInfo.revision : '0'
      return `${this.datasetInfo.version}.${revision}`
    },
  },

  methods: {
    /**
     * Get the dataset details tab area by id
     * @returns {Object}
     */
    getDatasetDetailsTabArea: function() {
      return document.getElementById('datasetDetailsTabsContainer')
    },

    /**
     * scroll to the dataset details tab area
     */
    scrollToDatasetDetailsTabArea: function() {
      this.getDatasetDetailsTabArea().scrollIntoView()
    },
    viewOtherVersionsClicked: function() {
      this.$router.replace({
        query: { ...this.$route.query, datasetDetailsTab: 'versions' }
      }).finally(() => {
        this.scrollToDatasetDetailsTabArea()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.dataset-information-box {
  border: 1px solid $cloudy;
  padding: 0.25rem 0.5rem;
  width: fit-content;
  margin-left: auto;
  p {
    margin-bottom: 0.25rem;
    font-size: 14px;
  }
  @media (max-width: 47rem) {
    margin-left: 0;
    margin-right: auto;
  }
  .active-link {
    color: $median;
    text-decoration: underline;
    cursor: pointer;
  }
  .header-stats-block {
    align-items: center;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    margin: 0.5rem 0;
    .svg-icon {
      margin-right: 3px;
    }
  }
}
</style>
