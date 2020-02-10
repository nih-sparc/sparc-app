<template>
  <div class="dataset-details">
    <details-header
      :subtitle="subtitles.toString()"
      :title="datasetTitle"
      :description="datasetDescription"
      :breadcrumb="breadcrumb"
    >
      <div slot="banner image">
        <dataset-banner-image :src="getDatasetImage" />
      </div>
      <div slot="meta content" class="details-header__container--content-links">
        <div class="dataset-meta">
          <div class="dataset-updated-date">
            Last updated on {{ lastUpdatedDate }}
          </div>
        </div>
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
        <div class="header-stats-section">
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
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-storage" height="20" width="20" />
            <div>
              <strong>{{ datasetStorage.number }}</strong>
              {{ datasetStorage.unit }}
            </div>
          </div>
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-license" height="20" width="20" />
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
        <div v-if="getDatasetType === 'simulation'">
          <button class="dataset-button">
            <a :href="`https://osparc.io/study/${this.simulationId}`" target="_blank">
              Run Simulation
            </a>
          </button>
          <a :href="`https://discover.blackfynn.com/datasets/${$route.params.datasetId}/index.html`" target="_blank" class="dataset-link">Get Dataset</a>
        </div>
        <div v-else>
          <button class="dataset-button" @click="isDownloadModalVisible = true">
            Get Dataset
          </button>
        </div>
      </div>
    </details-header>
    <detail-tabs
      :tabs="getDetailTabs"
      :active-tab="activeTab"
      class="container"
      @set-active-tab="setActiveTab"
    >
      <div v-if="getDatasetType === 'simulation'">
        <dataset-description-info
          v-show="activeTab === 'about'"
          :markdown="markdown"
          :loading-markdown="loadingMarkdown"
        />
      </div>
      <div v-else>
        <dataset-about-info
          v-show="activeTab === 'about'"
          :updated-date="lastUpdatedDate"
          :doi="datasetDOI"
          :doi-value="datasetDetails.doi"
          :dataset-records="datasetRecords"
          :dataset-tags="datasetTags"
        />
        <dataset-description-info
          v-show="activeTab === 'description'"
          :markdown="markdown"
          :loading-markdown="loadingMarkdown"
        />
        <dataset-files-info
          v-show="activeTab === 'files'"
          :dataset-details="datasetDetails"
        />
        <dataset-model-info v-show="activeTab === '3DModel'" />
      </div>
    </detail-tabs>
    <download-dataset
      :visible.sync="isDownloadModalVisible"
      :dataset-details="datasetDetails"
      :download-size="getDownloadSize"
      @close-download-dialog="isDownloadModalVisible = false"
    />
  </div>
</template>

<script>
import marked from 'marked'
import { propOr, pathOr, last, head, compose, split } from 'ramda'

import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'
import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import DownloadDataset from '@/components/DownloadDataset/DownloadDataset.vue'

import DatasetAboutInfo from '@/components/DatasetDetails/DatasetAboutInfo.vue'
import DatasetDescriptionInfo from '@/components/DatasetDetails/DatasetDescriptionInfo.vue'
import DatasetFilesInfo from '@/components/DatasetDetails/DatasetFilesInfo.vue'
import DatasetModelInfo from '@/components/DatasetDetails/DatasetModelInfo.vue'

import Request from '@/mixins/request'
import DateUtils from '@/mixins/format-date'
import FormatStorage from '@/mixins/bf-storage-metrics'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'

import createClient from '@/plugins/contentful.js'

const client = createClient()

marked.setOptions({
  sanitize: true
})

export default {
  name: 'DatasetDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    ContributorItem,
    DatasetBannerImage,
    DownloadDataset,
    DatasetAboutInfo,
    DatasetDescriptionInfo,
    DatasetFilesInfo,
    DatasetModelInfo
  },

  mixins: [Request, DateUtils, FormatStorage],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntries({
        content_type: process.env.ctf_organ_id
      })
    ])
      .then(([entries]) => {
        return {
          entries: entries.items
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      showCopySuccess: false,
      isLoadingDataset: false,
      datasetDetails: {},
      errorLoading: false,
      loadingMarkdown: false,
      markdown: '',
      datasetRecords: [],
      discover_host: process.env.discover_api_host,
      isContributorListVisible: true,
      isDownloadModalVisible: false,
      tabs: [
        {
          label: 'About',
          type: 'about'
        },
        {
          label: 'Description',
          type: 'description'
        },
        {
          label: 'Files',
          type: 'files'
        },
        {
          label: '3-D Model',
          type: '3DModel'
        }
      ],
      activeTab: 'about',
      breadcrumb: {
        name: 'data',
        type: this.$route.params.type,
        parent: 'Find Data'
      },
      subtitles: [],
      simulationId: ''
    }
  },

  computed: {
    /**
     * Get tabs based on dataset type
     * @returns {Array}
     */
    getDetailTabs: function() {
      return this.getDatasetType === 'simulation'
        ? [
            {
              label: 'About',
              type: 'about'
            }
          ]
        : this.tabs
    },
    /**
     * Get dataset type that is being displayed
     * @returns {String}
     */
    getDatasetType: function() {
      return this.$route.params.type
    },

    /**
     * Gets dataset size for download
     * @returns {Number}
     */
    getDownloadSize: function() {
      return propOr(0, 'size', this.datasetDetails)
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
     * Returns the files associated with the dataset
     * @returns {String}
     */
    datasetFiles: function() {
      return propOr('', 'fileCount', this.datasetDetails)
    },

    /**
     * Gets license link
     * @returns {String}
     */
    licenseLink: function() {
      return getLicenseLink(this.datasetLicense)
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
     * Returns dataset banner
     * @returns {String}
     */
    getDatasetImage: function() {
      return propOr('', 'banner', this.datasetDetails)
    },

    /**
     * Returns the list of contributors who contributed to the dataset
     * @returns {String}
     */
    datasetContributors: function() {
      return propOr([], 'contributors', this.datasetDetails)
    },
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
     * Gets the first contributor from the list
     * @returns {String}
     */
    firstContributor: function() {
      return head(this.datasetContributors)
    },
    /**
     * Returns the dataset title
     * @returns {String}
     */
    datasetTitle: function() {
      return propOr('', 'name', this.datasetDetails)
    },

    /**
     * Returns the records in the protocol model for this dataset
     * @returns {String}
     */
    getSearchRecordsUrl: function() {
      return `${this.discover_host}/search/records?datasetId=${this.datasetId}&model=protocol`
    },

    /**
     * Get the dataset DOI and return the url
     * @returns {String}
     */
    datasetDOI: function() {
      const doi = propOr('', 'doi', this.datasetDetails)
      return `https://doi.org/${doi}`
    },

    /**
     * Get formatted originally published date
     * @return {String}
     */
    originallyPublishedDate: function() {
      const date = propOr('', 'createdAt', this.datasetDetails)
      return this.formatDate(date)
    },
    /**
     * Get formatted last updated date
     * @return {String}
     */
    lastUpdatedDate: function() {
      const date = propOr('', 'updatedAt', this.datasetDetails)
      return this.formatDate(date)
    },
    /**
     * Returns list of tags for dataset
     * @returns {Array}
     */
    datasetTags: function() {
      return propOr([], 'tags', this.datasetDetails)
    },
    /**
     * Returns the current location href from the window object
     * @returns {String}
     */
    thisUrl: function() {
      // return ""
      return this.$route.fullPath
    },
    /**
     * Return DOI link
     * @returns {String}
     */
    DOIlink: function() {
      const doi = propOr('', 'doi', this.datasetDetails)
      return doi ? `https://doi.org/${doi}` : ''
    },

    /**
     * Compute description
     * @returns {String}
     */
    datasetDescription: function() {
      return propOr('', 'description', this.datasetDetails)
    },

    /**
     * Compute name
     * @returns {String}
     */
    datasetName: function() {
      return propOr('', 'name', this.datasetDetails)
    },

    /**
     * Compute organization name
     * @returns {String}
     */
    organizationName: function() {
      return propOr('', 'organizationName', this.datasetDetails)
    },

    /**
     * Compute endpoint URL to get dataset
     * @returns {String}
     */
    getDatasetUrl: function() {
      return `${this.discover_host}/datasets/${this.datasetId}`
    },

    /**
     * Get datasetid
     * @returns {String}
     */
    datasetId: function() {
      return pathOr('', ['params', 'datasetId'], this.$route)
    }
  },

  watch: {
    getDatasetUrl: {
      handler: function(val) {
        if (val) {
          this.getDataset()
        }
      },
      immediate: true
    },

    /**
     * Watcher for getSearchRecordsUrl
     */
    getSearchRecordsUrl: {
      handler: function(val) {
        if (val) {
          this.getProtocolRecords()
        }
      },
      immediate: true
    },

    datasetDetails: {
      handler: function() {
        this.getMarkdown()
      },
      immediate: true
    },

    datasetContributors: {
      handler: function(val) {
        if (val.length > 5) {
          this.isContributorListVisible = false
        }
      },
      immediate: true
    },

    datasetTags: {
      handler: function(val) {
        if (val) {
          this.entries.forEach(entry => {
            if (this.datasetTags.includes(entry.fields.name.toLowerCase())) {
              this.subtitles.push(entry.fields.name)
            }
          })
        }
      },
      immediate: true
    },

    getDatasetType: {
      handler: function(val) {
        if (val === 'simulation') {
          this.getSimulationId()
        }
      },
      immediate: true
    }
  },

  methods: {

    /**
     * Gets the uuid for the simulation dataset
     */
    getSimulationId: function() {
      const requestUrl = `${process.env.portal_api}/sim/dataset/${this.$route.params.datasetId}`
      this.$axios.$get(requestUrl).then(response => {
        this.simulationId = response.study.uuid
      })
    },
    /**
     * Sets active tab
     * @param {String} activeLabel
     */
    setActiveTab: function(activeLabel) {
      this.activeTab = activeLabel
    },
    /**
     * Returns protocol records in a dataset's model if they exist
     */
    getProtocolRecords: function() {
      this.$axios
        .$get(this.getSearchRecordsUrl)
        .then(response => {
          const records = propOr([], 'records', response)
          if (records.length !== 0) {
            // that means protocol records exist
            this.datasetRecords = records
          }
        })
        .catch(() => {
          // handle error
          this.errorLoading = true
        })
    },

    getDataset: function() {
      this.isLoadingDataset = true

      this.$axios
        .$get(this.getDatasetUrl)
        .then(response => {
          this.datasetDetails = response
        })
        .catch(() => {
          // handle error
          this.errorLoading = true
        })
        .finally(() => {
          this.isLoadingDataset = false
        })
    },

    /**
     * Confirms that url of dataset was copied successfully
     * and sets boolean to true
     */
    onCopySuccess: function() {
      this.showCopySuccess = true
    },

    /**
     * Get markdown logic from details response
     */
    getMarkdown: function() {
      this.loadingMarkdown = true
      const readme = propOr('', 'readme', this.datasetDetails)
      if (readme !== '') {
        fetch(readme)
          .then(response => response.text())
          .then(response => {
            this.loadingMarkdown = false
            this.markdown = response
          })
          .catch(error => {
            throw error
          })
      }
    }
  },

  metaInfo() {
    return {
      meta: [
        {
          name: 'DC.identifier',
          content: this.DOIlink,
          scheme: 'DCTERMS.URI'
        },
        {
          name: 'DC.publisher',
          content: this.organizationName
        },
        {
          name: 'DC.date',
          content: this.originallyPublishedDate,
          scheme: 'DCTERMS.W3CDTF'
        },
        {
          name: 'DC.identifier',
          content: this.thisUrl,
          scheme: 'DCTERMS.URI'
        },
        {
          property: 'og:url',
          content: this.thisUrl
        }
      ],
      script: [
        {
          vmid: 'ldjson-schema',
          innerHTML: `{"@context": "http://schema.org","@type": "Dataset","@id": "${this.DOIlink}","name": "${this.datasetName}","publisher": "${this.organizationName}", "datePublished": "${this.datasetDetails.createdAt}", "dateModified": "${this.datasetDetails.updatedAt}", "Description": "${this.datasetDescription}"}`,
          type: 'application/ld+json'
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'ldjson-schema': ['innerHTML']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_spacing.scss';
@import '@/assets/_variables.scss';
.details-header {
  &__container {
    &--content-links {
      .contributors-button {
        height: 14px;
        width: 18px;
        border: 1px solid $median;
        border-radius: 2px;
        background-color: $light-purple;
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
      .dataset-button {
        background-color: $median;
        width: 138px;
        height: 40px;
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
      }

      .dataset-link {
        text-decoration: none;
      }
    }
  }
}

.dataset-updated-date {
  line-height: 24px;
  color: black;
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

.dataset-owners {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  color: #404554;
  font-size: 14px;
  line-height: 24px;
  .contributor-item-wrap {
    display: inline-flex;
    margin-right: 4px;
  }
}

.header-stats-section {
  display: flex;
  margin: 20px 0 0;
}

.header-stats-block {
  align-items: center;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  margin-right: 12px;
  margin-bottom: 1rem;
  .svg-icon {
    margin-right: 3px;
  }
  a {
    margin-left: 0;
    font-size: 14px;
    &:focus {
      color: #1c46bd;
    }
  }
}

.dataset-details {
  width: 100%;
  overflow-x: hidden;
}
</style>
