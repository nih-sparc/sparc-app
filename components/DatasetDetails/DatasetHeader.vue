<template>
  <div class="details-header-container mt-16 py-16 px-24">
      <div class="bx--grid">
        <div class="bx--row">
          <div class="bx--col-sm-4 bx--col-md-6 bx--col-lg-13 bx--col-xlg-13">
            <h2 class="heading2">
              {{ title }}
            </h2>
            <div class="dataset-owners">
              <span class="label4">Contributors:&nbsp;</span>
              <div
                v-for="(contributor, idx) in contributors"
                :key="contributor.id"
                class="contributor-item-wrap mr-4"
              >
                <contributor-item :contributor="contributor" />
                <template v-if="idx < contributors.length - 1">
                  ,
                </template>
              </div>
            </div>
            <hr />
            <div>
              <span class="label4">Description: </span>{{ formatDescription(description) }}
            </div>
          </div>
          <div class="bx--col-sm-4 bx--col-md-2 bx--col-lg-3 bx--col-xlg-3">
            <dataset-information-box 
              :latest-version-revision="latestVersionRevision"
              :latest-version-date="latestVersionDate"
            />
          </div>
          <div class="bx--col-sm-4 bx--col-md-8 bx--col-lg-16 bx--col-xlg-16">
            <hr />
            <div v-if="primaryPublications">
              <div class="publications-container">
                <span class="primary-publications-title-column">
                  <span class="label4">Primary Publication(s): </span>
                </span>
                <span>
                  <div v-for="(item, index) in primaryPublications" :key="index" class="primary-publications-list-item">
                    <apa-citation class="mb-8" :doi="item.doi" :can-copy-citation="false" />
                  </div>
                </span>
              </div>
              <hr />
            </div>
            <div class="header-stats-block">
              <div>
                <span class="label4">
                  Usage Rights: 
                </span>
                <span>
                  <template v-if="license">
                    <sparc-tooltip
                      placement="left-center"
                      :content="licenseName"
                    >
                      <a slot="item" class="link1" :href="licenseLink" target="_blank">
                        {{ license }}
                      </a>
                    </sparc-tooltip>
                  </template>
                  <template v-else>
                    No License Selected
                  </template>
                </span>
              </div>
              <div class="metics-container">
                <span class="label4">Downloads: {{numDownloadsText}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { propOr } from 'ramda'
import ApaCitation from '@/components/DatasetCitations/ApaCitation'
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'
import DatasetInformationBox from '@/components/DatasetDetails/DatasetInformationBox.vue'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'

export default {
  name: 'DatasetHeader',

  components: {
    ContributorItem,
    DatasetInformationBox,
    ApaCitation,
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
    numCitations: {
      type: Number,
      default: 0
    },
    numDownloads: {
      type: Number,
      default: 0
    }
  },

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
    /**
     * Gets license link
     * @returns {String}
     */
    licenseLink: function() {
      return getLicenseLink(this.license)
    },
    /**
     * Returns the list of contributors who contributed to the dataset
     * @returns {String}
     */
    contributors: function() {
      return propOr([], 'contributors', this.datasetInfo)
    },
    /**
     * Compute description
     * @returns {String}
     */
    description: function() {
      return propOr('', 'description', this.datasetInfo)
    },
    /**
     * Returns list of external publications for dataset
     * @returns {Array}
     */
    externalPublications: function() {
      return propOr([], 'externalPublications', this.datasetInfo)
    },
    /**
     * Returns the dataset title
     * @returns {String}
     */
    title: function() {
      return propOr('', 'name', this.datasetInfo)
    },
    /**
     * Returns the license abbr associated with the dataset
     * @returns {String}
     */
    license: function() {
      const licenseKey = this.licenseName
      return getLicenseAbbr(licenseKey)
    },
    embargoed: function() {
      return propOr(false, 'embargo', this.datasetInfo)
    },
    /**
     * Returns the license name associated with the dataset
     * @returns {String}
     */
    licenseName: function() {
      return propOr('', 'license', this.datasetInfo)
    },
    primaryPublications: function() {
      const valObj = this.externalPublications.filter(function(elem) {
        return elem.relationshipType == 'IsDescribedBy'
      })
      return valObj.length > 0 ? valObj : null
    },
    showCitations: function() {
      return !this.embargoed && this.numCitations !== 0
    },
    numCitationsText: function() {
      return this.showCitations ? `${this.numCitations}` : 'n/a'
    },
    numDownloadsText: function() {
      return this.embargoed ? 'n/a' : `${this.numDownloads}`
    }
  },

  methods: {
    /**
     * Formats description based on length for regular viewports
     * @param {String} description
     */
    formatDescription: function(description) {
      return description.length > 540
        ? description.substring(0, 540) + '...'
        : description
    },
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
    numCitationsClicked: function() {
      this.$router.replace({
        query: { ...this.$route.query, datasetDetailsTab: 'references' }
      }).finally(() => {
        this.scrollToDatasetDetailsTabArea()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.details-header-container {
  display: flex;
  flex-direction: row;
  border: solid 1px $lineColor1;
  background: white;

  .publications-container {
    display: flex;
    @media (max-width: 48em) {
      flex-direction: column;
    }
    .primary-publications-title-column {
      min-width: 10.25rem;
    }
    .primary-publications-list-item:not(:last-child) {
      margin-bottom: .5rem;
    }
  }
  .bx--grid {
    padding: 0;
    [class*="bx--col"] {
      padding: 0 0.5rem;
    }
  }
  .header-stats-block {
    align-items: center;
    justify-content: space-between;
    display: flex;
  }
  hr {
    border-top: none;
    margin-top: 1rem;
  }
  .dataset-owners {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    .contributor-item-wrap {
      display: inline-flex;
    }
  }
  .citations-link {
    cursor: pointer;
  }
}
</style>
