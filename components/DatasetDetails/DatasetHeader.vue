<template>
  <div class="details-header__container">
    <div class="details-header__container--content">
      <div class="bx--grid">
        <div class="bx--row">
          <div class="bx--col-sm-4 bx--col-md-6 bx--col-lg-13 bx--col-xlg-13">
            <h3>
              {{ subtitle }}
            </h3>
            <h2 class="details-header__container--content-title-default">
              {{ formatTitle(title) }}
            </h2>
            <div class="dataset-owners">
              <p class="bullet-title">Contributors:</p>
              <div
                v-for="(contributor, idx) in contributors"
                :key="contributor.id"
                class="contributor-item-wrap"
              >
                <contributor-item :contributor="contributor" />
                <template v-if="idx < contributors.length - 1">
                  ,
                </template>
              </div>
            </div>
            <hr />
            <p>
              <strong>Description: </strong>{{ formatDescription(description) }}
            </p>
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
                  <p>
                    <strong>Primary Publication(s): </strong>
                  </p>
                </span>
                <span>
                  <div v-for="(item, index) in primaryPublications" :key="index" class="primary-publications-list-item">
                    <external-pub-link :publication="item" />
                  </div>
                </span>
              </div>
              <hr />
            </div>
            <div class="header-stats-block">
              <p class="bullet-title">Usage Rights:</p>
              <div>
                <template v-if="license">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="licenseName"
                    placement="top"
                    :visible-arrow="false"
                  >
                    <a :href="licenseLink" target="_blank">
                      {{ license }}
                    </a>
                  </el-tooltip>
                </template>
                <template v-else>
                  No License Selected
                </template>
              </div>
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
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'
import DatasetInformationBox from '@/components/DatasetDetails/DatasetInformationBox.vue'
import ExternalPubLink from '@/components/ExternalPubLink/ExternalPubLink'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'

export default {
  name: 'DatasetHeader',

  components: {
    ContributorItem,
    DatasetInformationBox,
    ExternalPubLink
  },

  props: {
    subtitle: {
      type: String,
      default: ''
    },
    latestVersionRevision: {
      type: String,
      default: ''
    },
    latestVersionDate: {
      type: String,
      default: ''
    },
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
    }
  },

  methods: {
    /**
     * Formats title length for regular viewports
     * @param {String} title
     */
    formatTitle: function(title) {
      return title.length > 150 ? title.substring(0, 150) + '...' : title
    },

    /**
     * Formats description based on length for regular viewports
     * @param {String} description
     */
    formatDescription: function(description) {
      return description.length > 540
        ? description.substring(0, 540) + '...'
        : description
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
p {
  margin: 0;
}
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
    display: flex;
    font-size: 14px;
    font-weight: 500;
  }
  hr {
    border-top: none;
    margin-top: 1rem;
  }
  .dataset-owners {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    line-height: 24px;
    .contributor-item-wrap {
      display: inline-flex;
      margin-right: 4px;
    }
  }
  p.bullet-title {
    margin-bottom: 0;
    margin-right: .5em;
    font-weight: bold;
  }
  .details-header {
    &__container {
      display: flex;
      flex-direction: row;
      border: solid 1px $cloudy;
      padding: 1rem 1.5rem;
      background: white;
      margin: 1.25rem 0 0;
      &--content {
        h3 {
          text-transform: uppercase;
          font-weight: 500;
          line-height: 24px;
          font-size: 14px;
          color: $medium-gray;
        }
      }
      &--content-title-default {
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }
      &--content-description-default {
        font-size: 14px;
        font-weight: normal;
        line-height: 24px;
      }
    }
  }
</style>
