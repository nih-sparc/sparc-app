<template>
  <div class="dataset-about-info">
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
    <p><strong>Award: </strong>{{awardSparcNumber}}</p>
    <hr />
    <p><strong>Associated project: </strong>
      <nuxt-link
        :to="associatedProjectLink"
      >
        {{associatedProjectTitle}}
      </nuxt-link>
    </p>
    <p><strong>Institution: </strong>{{associatedProjectInstitution}}</p>
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
</template>

<script>
import { propOr} from 'ramda'
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
    },
    associatedProject: {
      type: Object,
      default: () => {}
    }
  },

  mixins: [DateUtils],

  computed: {
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
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
     * Compute the project link
     * @returns {String}
     */
    associatedProjectLink: function() {
      const sys = propOr(null, 'sys', this.associatedProject)
      const entryId = propOr(null, 'id', sys)
      return entryId != null ? `/projects/${entryId}` : ''
    },
    /**
     * Compute the sparc award number
     * @returns {String}
     */
    awardSparcNumber: function() {
      const fields = propOr(null, 'fields', this.associatedProject)
      const awardNumber = propOr(null, 'awardId', fields)
      return awardNumber !== null ? `NIH ${awardNumber}` : 'N/A'
    },
    /**
     * Compute the project title
     * @returns {String}
     */
    associatedProjectTitle: function() {
      const fields = propOr(null, 'fields', this.associatedProject)
      const title = propOr(null, 'title', fields)
      return title ?? 'N/A'
    },
    /**
     * Compute the project institution
     * @returns {String}
     */
    associatedProjectInstitution: function() {
      const fields = propOr(null, 'fields', this.associatedProject)
      const institution = propOr(null, 'institution', fields)
      const institutionFields = propOr(null, 'fields', institution)
      const institutionName = propOr(null, 'name', institutionFields)
      return institutionName ?? 'N/A'
    },
  },
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
  }
}
</style>
