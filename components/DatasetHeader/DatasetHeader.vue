<template>
  <div class="dataset-header">
    <el-row type="flex" justify="center">
      <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
        <!-- <el-row class="breadcrumb">
          <el-col
            :xs="24"
            :sm="12"
          >
            <router-link
              :to="{ name: 'data' }"
            >
              <i class="el-icon-arrow-left" />
              View all Datasets
            </router-link>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :xs="24" :sm="12">
            <h1 class="dataset-title">
              {{ datasetTitle }}
            </h1>
            <div class="dataset-owners">
              <template v-if="!isContributorListVisible">
                <contributor-item :contributor="firstContributor" />
                <button
                  class="contributors-button"
                  href="#"
                  @click.prevent="isContributorListVisible = true"
                >
                  <span class="button-text">...</span>
                </button>
              </template>

              <div
                v-for="(contributor, idx) in datasetContributorsList"
                :key="contributor.id"
                class="contributor-item-wrap"
              >
                <contributor-item :contributor="contributor" />
                <template v-if="idx < datasetContributorsList.length - 1">
                  ,
                </template>
              </div>
            </div>
            <p class="dataset-description">
              {{ datasetDescription }}
            </p>
            <div class="dataset-doi">
              <p class="info-text">
                {{ datasetDOI }}
              </p>
            </div>

            <div class="dataset-meta">
              <div class="dataset-updated-date">
                Updated on {{ updatedDate }}
              </div>
            </div>

            <div class="dataset-actions">
              <bf-button
                class="get-dataset-button"
                @click="isDownloadModalVisible = true"
              >
                Get Dataset
              </bf-button>
            </div>

            <div class="header-stats-section">
              <div class="header-stats-block">
                <svg-icon
                  class="mr-8"
                  name="icon-files"
                  height="20"
                  width="20"
                />
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
              <div class="header-stats-block">
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
              <div class="header-stats-block">
                <svg-icon
                  class="mr-8"
                  name="icon-license"
                  height="20"
                  width="20"
                />
                <div>
                  <template v-if="datasetLicense">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="datasetLicenseName"
                      placement="top"
                      :visible-arrow="false"
                    >
                      <a :href="licenseLink" target="_blank">
                        {{ datasetLicense }}
                      </a>
                    </el-tooltip>
                  </template>

                  <template v-else>
                    No License Selected
                  </template>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="header-image-section">
              <dataset-banner-image
                class="dataset-image"
                :src="getDatasetImage"
              />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <download-dataset
      :visible.sync="isDownloadModalVisible"
      :dataset-details="datasetDetails"
      :download-size="getDownloadSize"
      @close-download-dialog="isDownloadModalVisible = false"
    />
  </div>
</template>

<script>
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import DownloadDataset from '@/components/DownloadDataset/DownloadDataset.vue'
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'

import FormatDate from '@/mixins/format-date'

import FormatStorage from '@/mixins/bf-storage-metrics'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'
import { compose, head, split, last, propOr } from 'ramda'
export default {
  name: 'DatasetHeader',

  components: {
    BfButton,
    ContributorItem,
    DatasetBannerImage,
    DownloadDataset
  },

  mixins: [FormatDate, FormatStorage],

  props: {
    datasetDetails: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      isDownloadModalVisible: false,
      isVersionModalVisible: false,
      isContributorListVisible: true
    }
  },

  computed: {
    /**
     * Compute contributors list based
     * on expanded list being show
     * @returns {Array}
     */
    datasetContributorsList: function() {
      return this.isContributorListVisible
        ? this.datasetContributors
        : [last(this.datasetContributors)]
    },

    /**
     * Compute URL for dataset on Blackfynn Discover
     * @returns {String}
     */
    discoverLink: function() {
      return `https://discover.blackfynn.com/datasets/${this.datasetId}`
    },

    /**
     * Determines whether list of contributors is long enough
     * to show the hide contributor button in the header
     * @returns {Boolean}
     */
    shouldTruncateList: function() {
      return this.datasetContributors.length >= 2
    },

    /**
     * Gets dataset size for download
     * @returns {Number}
     */
    getDownloadSize: function() {
      return propOr(0, 'size', this.datasetDetails)
    },

    /**
     * Gets dataset ID
     * @returns {Number}
     */
    datasetId: function() {
      return propOr(0, 'id', this.datasetDetails)
    },

    /**
     * Gets latest version number of dataset
     * @returns {Number}
     */
    latestVersion: function() {
      return propOr(1, 'version', this.datasetDetails)
    },

    /**
     * Gets license link
     * @returns {String}
     */
    licenseLink: function() {
      return getLicenseLink(this.datasetLicense)
    },

    /**
     * Returns the dataset title
     * @returns {String}
     */
    datasetTitle: function() {
      return propOr('', 'name', this.datasetDetails)
    },

    /**
     * Returns the dataset description
     * @returns {String}
     */
    datasetDescription: function() {
      return propOr('', 'description', this.datasetDetails)
    },

    /**
     * Returns the last updated date
     * @returns {String}
     */
    updatedDate: function() {
      return this.formatDate(propOr('', 'updatedAt', this.datasetDetails))
    },

    /**
     * Checks if a banner image exists or not
     * @returns {Boolean}
     */
    datasetImage: function() {
      const banner = propOr('', 'banner', this.datasetDetails)
      if (banner.indexOf('banner.jpg') === -1 || banner === '') {
        return true
      }
      return false
    },

    /**
     * Returns dataset banner
     * @returns {String}
     */
    getDatasetImage: function() {
      return propOr('', 'banner', this.datasetDetails)
    },

    /**
     * Returns the files associated with the dataset
     * @returns {String}
     */
    datasetFiles: function() {
      return propOr('', 'fileCount', this.datasetDetails)
    },

    /**
     * Returns the dataset storage count
     * @returns {Object}
     */
    datasetStorage: function() {
      const storage = compose(
        split(' '),
        this.formatMetric,
        propOr(0, 'size')
      )(this.datasetDetails)

      return storage.reduce((number, unit) => {
        return {
          number,
          unit
        }
      })
    },

    /**
     * Returns the dataset record count
     * @returns {String}
     */
    datasetRecords: function() {
      return propOr('', 'recordCount', this.datasetDetails)
    },

    /**
     * Returns the license abbr associated with the dataset
     * @returns {String}
     */
    datasetLicense: function() {
      const licenseKey = propOr('', 'license', this.datasetDetails)
      return getLicenseAbbr(licenseKey)
    },

    /**
     * Returns the license name associated with the dataset
     * @returns {String}
     */
    datasetLicenseName: function() {
      return propOr('', 'license', this.datasetDetails)
    },

    /**
     * Returns the list of contributors who contributed to the dataset
     * @returns {String}
     */
    datasetContributors: function() {
      return propOr([], 'contributors', this.datasetDetails)
    },

    /**
     * Gets the first contributor from the list
     * @returns {String}
     */
    firstContributor: function() {
      return head(this.datasetContributors)
    },

    /**
     * Gets the last contributor from the list
     * @returns {String}
     */
    lastContributor: function() {
      return this.datasetContributors[this.datasetContributors.length - 1]
    },

    /**
     * Compute dataset owner
     * @returns {String}
     */
    datasetOwner: function() {
      return propOr('', 'ownerName', this.datasetDetails)
    },

    /**
     * Get the dataset DOI and return the url
     * @returns {String}
     */
    datasetDOI: function() {
      const doi = propOr('', 'doi', this.datasetDetails)
      return `https://doi.org/${doi}`
    }
  },

  watch: {
    datasetContributors: function(val) {
      if (val.length > 5) {
        this.isContributorListVisible = false
      }
    }
  },

  methods: {
    /**
     * Opens the Get Dataset modal
     */
    getDataset: function() {
      this.isDownloadModalVisible = true
    },

    /**
     * Opens the version history modal
     */
    getVersionHistory: function() {
      this.isVersionModalVisible = true
    },

    /**
     * Closes the version history modal
     */
    closeVersionModal: function() {
      this.isVersionModalVisible = false
    }
  },

  metaInfo() {
    return {
      title: this.datasetTitle,
      meta: [
        {
          name: 'DC.type',
          content: 'Dataset'
        },
        {
          name: 'DC.title',
          content: this.datasetTitle
        },
        {
          name: 'DC.description',
          content: this.datasetDescription
        },
        {
          name: 'DC.creator',
          content: this.datasetOwner
        },
        {
          name: 'DC.creator',
          content: this.datasetContributors.join(', ')
        },
        {
          name: 'DCTERMS.license',
          content: this.licenseLink
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:title',
          content: this.datasetTitle
        },
        {
          property: 'og:description',
          content: this.datasetDescription
        },
        {
          property: 'og:image',
          content: this.getDatasetImage
        },
        {
          property: 'og:image:alt',
          content: `${this.datasetTitle} Banner Image`
        },
        {
          property: 'og:site_name',
          content: 'Blackfynn Discover'
        },

        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@blackfynn'
        },
        {
          name: 'twitter:description',
          content: this.datasetDescription
        },
        {
          name: 'twitter:image',
          content: this.getDatasetImage
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-bottom: 24px;
  a {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    text-decoration: none;
  }
}
.header-image-section {
  .dataset-image {
    display: block;
    height: auto;
    width: 100%;
    @media (max-width: 48em) {
      max-width: 400px;
    }
    @media (min-width: 48em) {
      width: 100%;
    }
  }
}

.header-stats-section {
  display: flex;
  margin: 40px 0 0;
}

.header-stats-block {
  align-items: center;
  display: flex;
  font-size: 14px;
  margin-right: 24px;
  &:not(:first-child) {
    border-left: 1px solid #909399;
    padding-left: 24px;
  }
  .svg-icon {
    margin-right: 8px;
  }
  a {
    &:focus {
      color: #1c46bd;
    }
  }
}

.dataset-header {
  padding: 48px 0;
  h1 {
    font-size: 1.8em;
    color: #000;
    font-weight: bold;
    margin: 0 0 8px;
    line-height: 40px;
    word-break: break-word;
  }
}
.dataset-description {
  color: #000;
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 32px;
}

.dataset-doi {
  height: 24px;
  color: #404554;
  font-size: 14px;
  line-height: 24px;

  a {
    color: #404554;
    text-decoration: underline;
    &:hover,
    &:active,
    &:visited {
      color: #404554;
    }
    &:focus {
      color: black;
    }
  }
}
.dataset-actions {
  padding: 8px 0;
}

.dataset-owners {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  color: #404554;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 40px;
  .contributor-item-wrap {
    display: inline-flex;
    margin-right: 4px;
  }
}

.dataset-updated-date {
  height: 24px;
  color: #404554;
  font-size: 14px;
  line-height: 24px;

  a {
    color: #404554;
    text-decoration: underline;
    &:hover,
    &:active,
    &:visited {
      color: #404554;
    }
    &:focus {
      color: black;
    }
  }
}

.get-dataset-button {
  height: 40px;
  width: 145px;
  font-weight: 600;
  line-height: 16px;
  font-size: 14px;
}

.contributors-button {
  height: 16px;
  width: 16px;
  border-radius: 2px;
  background-color: #dadada;
  cursor: pointer;
  margin: 0 6px;
  padding: 0;

  &:focus {
    background-color: #b6b7ba;
  }

  .button-text {
    position: relative;
    bottom: 5px;
  }
}
</style>
