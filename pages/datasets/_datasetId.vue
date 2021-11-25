<template>
  <div class="dataset-details">
    <details-header
      :subtitle="subtitles.toString()"
      :title="datasetTitle"
      :description="datasetDescription"
      :breadcrumb="breadcrumb"
    >
      <div slot="banner image" class="img-dataset">
        <dataset-banner-image :src="getDatasetImage" />
        <sparc-pill v-if="datasetInfo.embargo">
          Embargoed
        </sparc-pill>
      </div>
      <div slot="meta content" class="details-header__container--content-links">
        <div class="dataset-meta">
          <div class="dataset-updated-date">
            Last updated on {{ lastUpdatedDate }}
            <template v-if="datasetType !== 'simulation'">
              (
              <a
                href="#"
                class="version-link"
                @click.prevent="isVersionModalVisible = true"
              >
                {{ versionRevisionText }}
              </a>
              )
            </template>
          </div>
        </div>
        <div class="dataset-owners">
          <div
            v-for="(contributor, idx) in datasetContributors"
            :key="contributor.id"
            class="contributor-item-wrap"
          >
            <contributor-item :contributor="contributor" />
            <template v-if="idx < datasetContributors.length - 1">
              ,
            </template>
          </div>
        </div>
        <p v-if="datasetInfo.embargo" class="embargo-release-date">
          Release date: {{ formatDate(datasetInfo.embargoReleaseDate) }}
        </p>

        <template v-if="datasetInfo.embargo === false">
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
            <div v-if="datasetType !== 'simulation'" class="header-stats-block">
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
          <div v-if="datasetType === 'simulation' && datasetInfo.study">
            <a
              :href="`https://osparc.io/study/${getSimulationId}`"
              target="_blank"
              class="dataset-button-link"
            >
              <el-button class="dataset-button">
                Run Simulation
              </el-button>
            </a>
          </div>
          <div v-else>
            <el-button
              class="dataset-button"
              @click="isDownloadModalVisible = true"
            >
              Get Dataset
            </el-button>
            <el-button class="citation-button" @click="scrollToCitations">
              Cite Dataset
            </el-button>
            <nuxt-link
              :to="{
                name: 'help-helpId',
                params: {
                  helpId: ctfDatasetFormatInfoPageId
                }
              }"
              class="dataset-link"
            >
              SPARC Dataset Structure
            </nuxt-link>
          </div>
        </template>
      </div>
    </details-header>
    <div v-if="datasetInfo.embargo === false" class="container">
      <citation-details
        :doi-value="datasetInfo.doi"
        :published-date="originallyPublishedDate"
      />
    </div>
    <div v-if="datasetInfo.embargo === false" class="container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        default-tab="description"
      >
        <dataset-description-info
          v-show="activeTab === 'description'"
          :markdown="markdown"
          :dataset-records="datasetRecords"
          :loading-markdown="loadingMarkdown"
        />
        <dataset-about-info
          v-show="activeTab === 'about'"
          :updated-date="lastUpdatedDate"
          :doi="datasetDOI"
          :dataset-tags="datasetTags"
          :dataset-owner-name="datasetOwnerName"
          :dataset-owner-email="datasetOwnerEmail"
          :external-publications="externalPublications"
        />
        <dataset-files-info
          v-show="activeTab === 'files'"
          :dataset-details="datasetInfo"
          :osparc-viewers="osparcViewers"
        />
        <images-gallery
          v-show="activeTab === 'images'"
          :markdown="markdown.markdownTop"
          :dataset-biolucida="biolucidaImageData"
          :dataset-scicrunch="scicrunchData"
        />
      </detail-tabs>
    </div>
    <download-dataset
      :visible.sync="isDownloadModalVisible"
      :dataset-details="datasetInfo"
      :download-size="getDownloadSize"
      @close-download-dialog="isDownloadModalVisible = false"
    />
    <version-history
      :visible.sync="isVersionModalVisible"
      :dataset-id="datasetInfo.id"
      :latest-version="datasetInfo.latestVersion"
      :versions="versions"
      @close-version-dialog="closeVersionModal"
    />

    <dataset-version-message
      v-if="!isLatestVersion"
      :current-version="datasetInfo.version"
      :dataset-details="datasetInfo"
    />
  </div>
</template>

<script>
import marked from 'marked'
import { clone, propOr, pathOr, head, compose, split } from 'ramda'

import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import ContributorItem from '@/components/ContributorItem/ContributorItem.vue'
import DatasetBannerImage from '@/components/DatasetBannerImage/DatasetBannerImage.vue'
import DownloadDataset from '@/components/DownloadDataset/DownloadDataset.vue'

import DatasetAboutInfo from '@/components/DatasetDetails/DatasetAboutInfo.vue'
import DatasetDescriptionInfo from '@/components/DatasetDetails/DatasetDescriptionInfo.vue'
import DatasetFilesInfo from '@/components/DatasetDetails/DatasetFilesInfo.vue'
import ImagesGallery from '@/components/ImagesGallery/ImagesGallery.vue'
import VersionHistory from '@/components/VersionHistory/VersionHistory.vue'
import DatasetVersionMessage from '@/components/DatasetVersionMessage/DatasetVersionMessage.vue'
import SparcPill from '@/components/SparcPill/SparcPill.vue'

import Request from '@/mixins/request'
import DateUtils from '@/mixins/format-date'
import FormatStorage from '@/mixins/bf-storage-metrics'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'

import Scaffolds from '@/static/js/scaffolds.js'
import Uberons from '@/static/js/uberon-map.js'

import createClient from '@/plugins/contentful.js'

import biolucida from '@/services/biolucida'
import scicrunch from '@/services/scicrunch'
import CitationDetails from '~/components/CitationDetails/CitationDetails.vue'

const client = createClient()

marked.setOptions({
  sanitize: true
})

const tabs = [
  {
    label: 'Description',
    type: 'description'
  },
  {
    label: 'About',
    type: 'about'
  },
  {
    label: 'Files',
    type: 'files'
  }
]

/**
 * Get organ entries from contentful
 * @returns {Array}
 */
const getOrganEntries = async () => {
  try {
    const organEntries = await client.getEntries({
      content_type: process.env.ctf_organ_id
    })
    return organEntries.items || []
  } catch (error) {
    return []
  }
}

/**
 * Get Dataset details
 * @param {Number} datasetId
 * @param {Number} version
 * @param {String} datasetType
 * @param {Function} $axios
 * @returns {Object}
 */
const getDatasetDetails = async (datasetId, version, datasetType, $axios) => {
  const url = `${process.env.discover_api_host}/datasets/${datasetId}`
  const datasetUrl = version ? `${url}/versions/${version}` : url

  const simulationUrl = `${process.env.portal_api}/sim/dataset/${datasetId}`

  try {
    const datasetDetails =
      datasetType === 'simulation'
        ? await $axios.$get(simulationUrl)
        : await $axios.$get(datasetUrl)

    const datasetOwnerId = datasetDetails.ownerId || ''
    const datasetOwnerEmail = await $axios
      .$get(`${process.env.portal_api}/get_owner_email/${datasetOwnerId}`)
      .then(resp => {
        return resp.email
      })
      .catch(() => {
        return ''
      })
    datasetDetails.ownerEmail = datasetOwnerEmail

    return datasetDetails
  } catch (error) {
    return {}
  }
}

/**
 * Get all the versions of the datasets
 * @param {Number} datasetId
 * @param {Object} $axios
 * @returns {Array}
 */
const getDatasetVersions = async (datasetId, $axios) => {
  try {
    const url = `${process.env.discover_api_host}/datasets/${datasetId}/versions`
    return $axios.$get(url).then(response => {
      return response.sort((a, b) => a.verson - b.version)
    })
  } catch (error) {
    return []
  }
}

const getBiolucidaData = async datasetId => {
  try {
    return biolucida.searchDataset(datasetId)
  } catch (e) {
    return {}
  }
}

/**
 * Get data for objects that have a data specific viewer.
 * @param {Number} datasetId
 * @param {String} datasetType
 */
const getThumbnailData = async (datasetDoi, datasetId, datasetVersion) => {
  let biolucidaImageData = {}
  let scicrunchData = {}
  try {
    const [biolucida_response, scicrunch_response] = await Promise.all([
      getBiolucidaData(datasetId),
      scicrunch.getDatasetInfoFromDOI(datasetDoi)
    ])

    if (biolucida_response.status === 'success') {
      biolucidaImageData = biolucida_response
      biolucidaImageData['discover_dataset_version'] = datasetVersion
    }
    if (scicrunch_response.data.result.length > 0) {
      scicrunchData = scicrunch_response.data.result[0]
      scicrunchData.discover_dataset = {
        id: Number(datasetId),
        version: datasetVersion
      }

      // Check for flatmap neuron data
      if (scicrunchData.organs) {
        let flatmapData = [{}]
        for (let i in scicrunchData.organs) {
          if (flatmapData.length <= i) {
            flatmapData.push({})
          }
          flatmapData[i].taxo = Uberons.species['rat']
          flatmapData[i].uberonid = scicrunchData.organs[i].curie
          flatmapData[i].id = datasetId
          flatmapData[i].version = datasetVersion
        }
        scicrunchData['flatmaps'] = flatmapData
      }
    }
  } catch (e) {
    return {
      biolucidaImageData: {},
      scicrunchData: {}
    }
  }
  return {
    biolucidaImageData,
    scicrunchData
  }
}

export default {
  name: 'DatasetDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    CitationDetails,
    ContributorItem,
    DatasetBannerImage,
    DownloadDataset,
    DatasetAboutInfo,
    DatasetDescriptionInfo,
    DatasetFilesInfo,
    ImagesGallery,
    VersionHistory,
    DatasetVersionMessage,
    SparcPill
  },

  mixins: [Request, DateUtils, FormatStorage],

  async asyncData({ route, $axios }) {
    let tabsData = clone(tabs)

    const datasetId = pathOr('', ['params', 'datasetId'], route)

    const [organEntries, datasetDetails, versions] = await Promise.all([
      getOrganEntries(),
      getDatasetDetails(
        datasetId,
        route.params.version,
        route.query.type,
        $axios
      ),
      getDatasetVersions(datasetId, $axios)
    ])

    const { biolucidaImageData, scicrunchData } = await getThumbnailData(
      datasetDetails.doi,
      datasetId,
      datasetDetails.version
    )

    // Get oSPARC file viewers
    const osparcViewers = await $axios
      .$get(`${process.env.portal_api}/get_osparc_data`)
      .then(osparcData => osparcData['file_viewers'])
      .catch(() => {
        return {}
      })

    if (
      ('dataset_images' in biolucidaImageData &&
        biolucidaImageData.dataset_images.length > 0) ||
      Object.getOwnPropertyNames(scicrunchData).length > 0
    ) {
      tabsData.push({ label: 'Gallery', type: 'images' })
    }

    return {
      biolucidaImageData,
      datasetInfo: datasetDetails,
      datasetType: route.query.type,
      entries: organEntries,
      osparcViewers,
      scicrunchData,
      tabs: tabsData,
      versions
    }
  },

  data() {
    return {
      showCopySuccess: false,
      isLoadingDataset: false,
      errorLoading: false,
      loadingMarkdown: false,
      markdown: {},
      activeTab: this.$route.query.tab ? this.$route.query.tab : 'description',
      datasetRecords: [],
      discover_host: process.env.discover_api_host,
      isDownloadModalVisible: false,
      tabs: [],
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
      ctfDatasetFormatInfoPageId: process.env.ctf_dataset_format_info_page_id,
      isVersionModalVisible: false
    }
  },

  computed: {
    defaultTab() {
      return this.tabs[0].type
    },
    /**
     * Compute if the dataset is the latest version
     * @returns {Boolean}
     */
    isLatestVersion() {
      if (this.versions.length) {
        const latestVersion = compose(propOr(1, 'version'), head)(this.versions)
        return this.datasetInfo.version === latestVersion
      }

      return true
    },

    /**
     * Returns simulation id for run simulation button
     * @returns {String}
     */
    getSimulationId: function() {
      return this.datasetInfo.study.uuid || ''
    },

    /**
     * Gets dataset version
     * @returns {Number}
     */
    getDatasetVersion: function() {
      return propOr(1, 'version', this.datasetInfo)
    },

    /**
     * Gets dataset version
     * @returns {Number}
     */
    getDatasetId: function() {
      return propOr(0, 'id', this.datasetInfo)
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
     * Returns list of tags for dataset
     * @returns {Array}
     */
    datasetTags: function() {
      return propOr([], 'tags', this.datasetInfo)
    },
    /**
     * Returns list of external publications for dataset
     * @returns {Array}
     */
    externalPublications: function() {
      return propOr([], 'externalPublications', this.datasetInfo)
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
    },

    /**
     * computes the right text based on the version and revision
     * @returns {String}
     */
    versionRevisionText() {
      const versionText = `Version ${this.datasetInfo.version}`
      const revisionText = this.datasetInfo.revision
        ? `, Revision ${this.datasetInfo.revision}`
        : ''
      return versionText + revisionText
    }
  },

  watch: {
    '$route.query': 'queryChanged',
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
     * Returns protocol records in a dataset's model if they exist.
     * First, check if the dataset has external publications with type
     * "isSupplementedBy" which is leveraged to contain the protocols in SPARC.
     *
     * To support backward compatibility, if this does not exist, check if there
     * are records of type Protocol and only show those that are defined as a doi.
     *
     * This workflow allows datasets to be updated as a revision to update the protocols
     * on the portal instead of requiring the dataset to be fully republished.
     */
    getProtocolRecords: function() {
      if (
        this.datasetInfo.externalPublications &&
        this.datasetInfo.externalPublications.length !== 0
      ) {
        const allPubs = this.datasetInfo.externalPublications
        const allProtocols = allPubs.filter(
          x => x.relationshipType === 'IsSupplementedBy'
        )
        this.datasetRecords = allProtocols.map(obj => {
          return { url: `https://doi.org/${obj.doi}` }
        })
      } else {
        this.$axios
          .$get(this.getSearchRecordsUrl)
          .then(response => {
            const records = propOr([], 'records', response)
            if (records.length !== 0) {
              // that means protocol records exist
              const allProtocols = records.filter(protocol =>
                protocol.properties.url.startsWith('https://doi.org')
              )
              this.datasetRecords = allProtocols.map(obj => {
                return { url: obj.properties.url }
              })
            }
          })
          .catch(() => {
            // handle error
            this.errorLoading = true
          })
      }
    },

    /**
     * Set the active tab to match the current query values.
     */
    queryChanged: function() {
      this.activeTab = this.$route.query.tab
        ? this.$route.query.tab
        : this.defaultTab
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
            const splitDelim = '\n\n---'
            const splitResponse = response.split(splitDelim)
            this.markdown = {
              markdownTop: splitResponse[0],
              markdownBottom: splitResponse[1]
                ? splitDelim + splitResponse[1]
                : ''
            }
          })
          .catch(error => {
            throw error
          })
      }
    },

    /**
     * Get the citations area in the
     * About tab by id
     * @returns {Object}
     */
    getCitationsArea: function() {
      return document.getElementById('citationsArea')
    },

    /**
     * Scroll to the citations area
     * in the About tab
     */
    scrollToCitations: function() {
      this.getCitationsArea().scrollIntoView()
    },

    /**
     * Closes the version history modal
     */
    closeVersionModal: function() {
      this.isVersionModalVisible = false
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
    const contributors = this.datasetContributors.map(contributor => {
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
          content: '@sparc_science'
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
          content: 'Pennsieve Discover'
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
            dateModified: this.datasetInfo.revisedAt,
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
            name: 'Pennsieve Discover'
          },
          type: 'application/ld+json'
        }
      ]
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
        width: auto;
        height: 40px;
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
        text-transform: uppercase;
        a {
          color: #fff;
        }
      }
      .dataset-button-link {
        margin: 0;
      }
      .citation-button {
        margin-left: 0.5rem;
        padding-top: 0.688rem;
        width: 8rem;
        background: #f9f2fc;
        border: 1px solid $median;
        color: $median;
        text-transform: uppercase;
        &:hover {
          color: #1a1489;
        }
        @media (max-width: 24em) {
          margin-top: 10px;
          margin-left: 0;
        }
      }
      .dataset-link {
        text-decoration: none;
      }
    }
  }
}

.details-header__container--content-links .version-link {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1rem;
  margin: 0 !important;
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

.img-dataset {
  display: block;
  position: relative;
  .sparc-pill {
    font-size: 0.75rem;
    position: absolute;
    right: 0.25rem;
    top: 0.5rem;
  }
  img {
    display: block;
  }
}
.embargo-release-date {
  font-size: 0.875rem;
  margin: 1.5rem 0 0;
}
</style>
