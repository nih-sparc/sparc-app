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
        <div v-if="datasetType === 'simulation'">
          <button class="dataset-button">
            <a
              :href="`https://osparc.io/study/${getSimulationId}`"
              target="_blank"
            >
              Run Simulation
            </a>
          </button>
          <a
            :href="
              `https://discover.blackfynn.com/datasets/${$route.params.datasetId}/index.html`
            "
            target="_blank"
            class="dataset-link"
          >
            Get Dataset
          </a>
        </div>
        <div v-else>
          <button class="dataset-button" @click="isDownloadModalVisible = true">
            Get Dataset
          </button>
          <nuxt-link
            :to="{
              name: 'help-helpId',
              params: {
                helpId: ctfDatasetFormatInfoPageId
              }
            }"
            class="dataset-link"
          >
            Dataset Format Information
          </nuxt-link>
        </div>
      </div>
    </details-header>
    <div class="container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        @set-active-tab="setActiveTab"
      >
        <dataset-about-info
          v-show="activeTab === 'about'"
          :updated-date="lastUpdatedDate"
          :doi="datasetDOI"
          :doi-value="datasetInfo.doi"
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
          :dataset-details="datasetInfo"
        />
        <client-only placeholder="Loading viewer...">
          <div v-show="activeTab === '3DScaffold'" class="scaffold">
            <scaffold-vuer v-if="scaffold" :url="scaffold" />
            <p v-else>
              No 3D scaffold available
            </p>
          </div>
        </client-only>
        <images-table
          v-show="activeTab === 'images'"
          :table-data="imagesData.dataset_images"
        />
      </detail-tabs>
    </div>
    <download-dataset
      :visible.sync="isDownloadModalVisible"
      :dataset-details="datasetInfo"
      :download-size="getDownloadSize"
      @close-download-dialog="isDownloadModalVisible = false"
    />
  </div>
</template>

<script>
import marked from 'marked'
import { clone, propOr, pathOr, last, head, compose, split } from 'ramda'
import '@abi-software/scaffoldvuer'
import '@abi-software/scaffoldvuer/dist/scaffoldvuer.css'

import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'
import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import DownloadDataset from '@/components/DownloadDataset/DownloadDataset.vue'

import DatasetAboutInfo from '@/components/DatasetDetails/DatasetAboutInfo.vue'
import DatasetDescriptionInfo from '@/components/DatasetDetails/DatasetDescriptionInfo.vue'
import DatasetFilesInfo from '@/components/DatasetDetails/DatasetFilesInfo.vue'
import ImagesTable from '@/components/ImagesTable/ImagesTable.vue'

import Request from '@/mixins/request'
import DateUtils from '@/mixins/format-date'
import FormatStorage from '@/mixins/bf-storage-metrics'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'

import Scaffolds from '@/static/js/scaffolds.js'

import createClient from '@/plugins/contentful.js'

const client = createClient()

marked.setOptions({
  sanitize: true
})

const tabs = [
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
  }
]

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
    ImagesTable
  },

  mixins: [Request, DateUtils, FormatStorage],

  async asyncData({ route, $axios }) {
    const organEntries = await client.getEntries({
      content_type: process.env.ctf_organ_id
    })

    const datasetId = pathOr('', ['params', 'datasetId'], route)
    const datasetUrl = `${process.env.discover_api_host}/datasets/${datasetId}`
    const simulationUrl = `${process.env.portal_api}/sim/dataset/${datasetId}`
    let datasetDetails = {}

    if (route.query.type === 'simulation') {
      datasetDetails = await $axios.$get(simulationUrl)
    } else {
      datasetDetails = await $axios.$get(datasetUrl)
    }

    const imagesData = await $axios
      .$get(
        `${process.env.BL_SERVER_URL}/imagemap/search_dataset/discover/${route.params.datasetId}`
      )
      .catch(() => {
        return {}
      })

    const tabsData = clone(tabs)

    if (imagesData.status === 'success') {
      tabsData.push({ label: 'Images', type: 'images' })
    }

    // @TODO Add logic for 3D Scaffold
    const hasScaffold = false
    if (hasScaffold) {
      tabsData.push({
        label: '3D Scaffold',
        type: '3DScaffold'
      })
    }

    return {
      entries: organEntries.items,
      datasetInfo: datasetDetails,
      datasetType: route.query.type,
      imagesData,
      tabs: tabsData
    }
  },

  data() {
    return {
      showCopySuccess: false,
      isLoadingDataset: false,
      errorLoading: false,
      loadingMarkdown: false,
      markdown: '',
      datasetRecords: [],
      discover_host: process.env.discover_api_host,
      isContributorListVisible: true,
      isDownloadModalVisible: false,
      tabs: [],
      activeTab: 'about',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          to: {
            name: 'data',
            query: {
              type: this.$route.query.type
            }
          },
          label: 'Find Data'
        }
      ],
      subtitles: [],
      ctfDatasetFormatInfoPageId: process.env.ctf_dataset_format_info_page_id
    }
  },

  computed: {
    /**
     * Returns simulation id for run simulation button
     * @returns {String}
     */
    getSimulationId: function() {
      return this.datasetInfo.study.uuid || ''
    },

    /**
     * Gets dataset size for download
     * @returns {Number}
     */
    getDownloadSize: function() {
      return propOr(0, 'size', this.datasetInfo)
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
      return propOr('', 'fileCount', this.datasetInfo)
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
      const licenseKey = propOr('', 'license', this.datasetInfo)
      return getLicenseAbbr(licenseKey)
    },

    /**
     * Returns the license name associated with the dataset
     * @returns {String}
     */
    datasetLicenseName: function() {
      return propOr('', 'license', this.datasetInfo)
    },

    /**
     * Returns dataset banner
     * @returns {String}
     */
    getDatasetImage: function() {
      return propOr('', 'banner', this.datasetInfo)
    },

    /**
     * Returns the list of contributors who contributed to the dataset
     * @returns {String}
     */
    datasetContributors: function() {
      return propOr([], 'contributors', this.datasetInfo)
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
      return propOr('', 'name', this.datasetInfo)
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
      const doi = propOr('', 'doi', this.datasetInfo)
      return `https://doi.org/${doi}`
    },
    /**
     * Get formatted originally published date
     * @return {String}
     */
    originallyPublishedDate: function() {
      const date = propOr('', 'createdAt', this.datasetInfo)
      return this.formatDate(date)
    },
    /**
     * Get formatted last updated date
     * @return {String}
     */
    lastUpdatedDate: function() {
      const date = propOr('', 'updatedAt', this.datasetInfo)
      return this.formatDate(date)
    },
    /**
     * Returns list of tags for dataset
     * @returns {Array}
     */
    datasetTags: function() {
      return propOr([], 'tags', this.datasetInfo)
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
      const doi = propOr('', 'doi', this.datasetInfo)
      return doi ? `https://doi.org/${doi}` : ''
    },

    /**
     * Compute description
     * @returns {String}
     */
    datasetDescription: function() {
      return propOr('', 'description', this.datasetInfo)
    },

    /**
     * Compute name
     * @returns {String}
     */
    datasetName: function() {
      return propOr('', 'name', this.datasetInfo)
    },

    /**
     * Compute organization name
     * @returns {String}
     */
    organizationName: function() {
      return propOr('', 'organizationName', this.datasetInfo)
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
    },

    /**
     * Compute the organ type
     * This assumes that the subtitles are the organ types
     * @TODO Adjust this based on how 3D scaffold is associated with Dataset
     * @returns {String}
     */
    organType: function() {
      return this.subtitles[0] || ''
    },

    /**
     * Compute the scaffold type based on organ type
     * @returns {String}
     */
    scaffold: function() {
      return Scaffolds[this.organType.toLowerCase()]
    }
  },

  watch: {
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

    datasetInfo: {
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
            const name = pathOr('', ['fields', 'name'], entry)
            if (this.datasetTags.includes(name.toLowerCase())) {
              this.subtitles.push(entry.fields.name)
            }
          })
        }
      },
      immediate: true
    }
  },

  methods: {
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
      const readme = propOr('', 'readme', this.datasetInfo)
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

  head() {
    // Creator data
    const org = [
      {
        '@type': 'Organization',
        name: this.organizationName
      }
    ]
    const contributors = this.datasetContributors.map((contributor) => {
      const sameAs = contributor.orcid
        ? `http://orcid.org/${contributor.orcid}`
        : null

      return {
        '@type': 'Person',
        sameAs,
        givenName: contributor.firstName,
        familyName: contributor.lastName,
        name: `${contributor.firstName} ${contributor.lastName}`
      }
    })

    const creators = contributors.concat(org)

    return {
      title: `${this.datasetTitle} - SPARC Portal`,
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
          content: 'SPARC Portal'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@sparc'
        },
        {
          name: 'twitter:description',
          content: this.datasetDescription
        },
        {
          name: 'twitter:image',
          content: this.getDatasetImage
        },
        {
          name: 'DC.creator',
          content: JSON.stringify(creators)
        },
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
          name: 'DC.version',
          content: this.datasetInfo.version
        },
        {
          property: 'og:url',
          content: process.env.siteUrl
        }
      ],
      script: [
        {
          vmid: 'ldjson-schema',
          json: {
            '@context': 'http://schema.org',
            '@type': 'Dataset',
            '@id': this.DOIlink,
            sameAs: this.getDatasetUrl,
            name: this.datasetName,
            creator: creators,
            datePublished: this.datasetInfo.createdAt,
            dateModified: this.datasetInfo.updatedAt,
            description: this.datasetDescription,
            license: this.licenseLink,
            version: this.datasetInfo.version,
            url: process.env.siteUrl,
            citation: this.citationText,
            identifier: this.DOIlink,
            isAccessibleForFree: true
          },
          type: 'application/ld+json'
        },
        {
          vmid: 'ldjson-schema',
          json: {
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            url: process.env.siteUrl,
            name: 'Blackfynn Discover'
          },
          type: 'application/ld+json'
        }
      ],
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
        text-transform: uppercase;
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
.scaffold {
  height: 500px;
}
</style>
