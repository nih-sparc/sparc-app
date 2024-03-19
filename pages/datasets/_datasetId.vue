<template>
  <div class="dataset-details pb-16">
    <client-only>
      <breadcrumb :breadcrumb="breadcrumb" :title="datasetTitle" />
      <div v-if="showTombstone">
        <tombstone
          :dataset-details="datasetInfo"
        />
      </div>
      <div v-else>
        <div class="bx--grid">
          <div class="bx--row">
            <div class="bx--col-sm-4 bx--col-md-2 bx--col-lg-3 bx--col-xlg-3 left-column">
              <dataset-action-box />
              <similar-datasets-info-box
                :associated-projects="associatedProjects"
                :dataset-type-name="datasetTypeName"
              />
            </div>
            <div class="bx--col-sm-4 bx--col-md-6 bx--col-lg-13 bx--col-xlg-13 right-column">
              <dataset-header
                class="dataset-header"
                :latestVersionRevision="latestVersionRevision"
                :latestVersionDate="latestVersionDate"
                :numCitations="numCitations"
                :numDownloads="numDownloads"
              />
              <content-tab-card
                class="mt-32"
                id="datasetDetailsTabsContainer"
                :tabs="tabs"
                :active-tab-id="activeTabId"
                @tab-changed="tabChanged"
                linkComponent="nuxt-link"
                routeName="datasetDetailsTab"
              >
                <dataset-description-info
                  class="body1"
                  v-show="activeTabId === 'abstract'"
                  :markdown="markdown"
                  :dataset-records="datasetRecords"
                  :loading-markdown="loadingMarkdown"
                  :dataset-tags="datasetTags"
                />
                <dataset-about-info
                  class="body1"
                  v-show="activeTabId === 'about'"
                  :latestVersionRevision="latestVersionRevision"
                  :latestVersionDate="latestVersionDate"
                  :associated-projects="associatedProjects"
                />
                <citation-details
                  class="body1"
                  v-show="activeTabId === 'cite'"
                  :doi-value="datasetInfo.doi"
                />
                <dataset-files-info
                  class="body1"
                  v-if="hasFiles"
                  v-show="activeTabId === 'files'"
                />
                <images-gallery
                  class="body1"
                  :markdown="markdown.markdownTop"
                  v-show="activeTabId === 'images'"
                />
                <dataset-references
                  v-if="hasCitations"
                  class="body1"
                  v-show="activeTabId === 'references'"
                  :primary-publications="primaryPublications"
                  :associated-publications="associatedPublications"
                />
                <version-history
                  v-if="canViewVersions"
                  class="body1"
                  v-show="activeTabId === 'versions'"
                  :versions="versions"
                />
              </content-tab-card>
            </div>
          </div>
        </div>
      </div>
      <dataset-version-message
        v-if="!isLatestVersion"
        :current-version="datasetInfo.version"
        :dataset-details="datasetInfo"
      />
    </client-only>
  </div>
</template>

<script>
import marked from 'marked'
import { mapState } from 'vuex'
import { clone, propOr, pathOr, head, compose } from 'ramda'
import { getAlgoliaFacets, facetPropPathMapping } from '../../pages/data/utils'
import createAlgoliaClient from '@/plugins/algolia.js'

import DatasetHeader from '@/components/DatasetDetails/DatasetHeader.vue'
import DatasetActionBox from '@/components/DatasetDetails/DatasetActionBox.vue'

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import CitationDetails from '@/components/CitationDetails/CitationDetails.vue'
import DatasetAboutInfo from '@/components/DatasetDetails/DatasetAboutInfo.vue'
import DatasetReferences from '~/components/DatasetDetails/DatasetReferences.vue'
import DatasetDescriptionInfo from '@/components/DatasetDetails/DatasetDescriptionInfo.vue'
import DatasetFilesInfo from '@/components/DatasetDetails/DatasetFilesInfo.vue'
import SimilarDatasetsInfoBox from '@/components/DatasetDetails/SimilarDatasetsInfoBox.vue'
import ImagesGallery from '@/components/ImagesGallery/ImagesGallery.vue'
import VersionHistory from '@/components/VersionHistory/VersionHistory.vue'
import DatasetVersionMessage from '@/components/DatasetVersionMessage/DatasetVersionMessage.vue'
import Tombstone from '@/components/Tombstone/Tombstone.vue'

import ErrorMessages from '@/mixins/error-messages'
import Request from '@/mixins/request'
import DateUtils from '@/mixins/format-date'
import FormatStorage from '@/mixins/bf-storage-metrics'
import { getLicenseLink, getLicenseAbbr } from '@/static/js/license-util'

import Scaffolds from '@/static/js/scaffolds.js'

import createClient from '@/plugins/contentful.js'

import { failMessage } from '@/utils/notification-messages'

const client = createClient()
const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)

marked.setOptions({
  sanitize: true
})

const tabs = [
  {
    label: 'Abstract',
    id: 'abstract'
  },
  {
    label: 'About',
    id: 'about'
  },
  {
    label: 'Cite',
    id: 'cite'
  },
  {
    label: 'Gallery',
    id: 'images'
  },
]

const getDatasetFacetsData = async (route) => {
  const objectId = route.params.datasetId
  const filter = `objectID:${objectId}`
  return await getAlgoliaFacets(algoliaIndex, facetPropPathMapping, filter).then(data => {
    return data
  })
}

/**
 * Get associated project from contentful
 * @returns {Array}
 */
const getAssociatedProjects = async (sparcAwardNumbers) => {
  try {
    const projects = await client.getEntries({
      content_type: process.env.ctf_project_id,
    })
    const associatedProjects = projects.items?.filter((project) => {
      return sparcAwardNumbers.includes(pathOr('', ['fields', 'awardId'], project) ) 
    })
    return associatedProjects || []
  } catch (error) {
    return []
  }
}

/**
 * Get Dataset details
 * @param {Number} datasetId
 * @param {Number} version
 * @param {String} datasetTypeName
 * @param {Function} $axios
 * @returns {Object}
 */
const getDatasetDetails = async (datasetId, version, $axios) => {
  const url = `${process.env.portal_api}/sim/dataset/${datasetId}`
  var datasetUrl = version ? `${url}/versions/${version}` : url

  const datasetDetails = await $axios.$get(datasetUrl).catch((error) => { 
          const status = pathOr('', ['data', 'status'], error.response)
          if (status === 'UNPUBLISHED') {
            const details = error.response.data
            return {
              isUnpublished: true,
              ...details
            }
          }
        })

  return datasetDetails
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

const getDownloadsSummary = async ($axios) => {
  try {
    const startDate = new Date('2000','1');
    const currentDate = new Date()
    const url = `${process.env.discover_api_host}/metrics/dataset/downloads/summary`
    return $axios.$get(url, {
        params: { startDate: startDate, endDate: currentDate }
      }).then(response => {
      return response
    })
  } catch (error) {
    return 0
  }
}


export default {
  name: 'DatasetDetails',

  components: {
    Breadcrumb,
    DatasetHeader,
    DatasetActionBox,
    CitationDetails,
    DatasetReferences,
    DatasetAboutInfo,
    DatasetDescriptionInfo,
    DatasetFilesInfo,
    ImagesGallery,
    VersionHistory,
    DatasetVersionMessage,
    SimilarDatasetsInfoBox,
    Tombstone
  },

  mixins: [Request, DateUtils, FormatStorage],

  async asyncData({ route, $axios, store, error }) {
    let tabsData = clone(tabs)

    const datasetId = pathOr('', ['params', 'datasetId'], route)

    const datasetFacetsData = await getDatasetFacetsData(route)
    const typeFacet = datasetFacetsData.find(child => child.key === 'item.types.name')
    const datasetTypeName = typeFacet !== undefined ? typeFacet.children[0].label : 'dataset'

    const errorMessages = []

    const [datasetDetails, versions, downloadsSummary] = await Promise.all([
      getDatasetDetails(
        datasetId,
        route.params.version,
        $axios
      ),
      getDatasetVersions(datasetId, $axios),
      getDownloadsSummary($axios),
    ])
    
    if (!datasetDetails) {
      //critical error messages
      error({ statusCode: 400, message: ErrorMessages.methods.discover(), display: true})
    }

    store.dispatch('pages/datasets/datasetId/setDatasetInfo', datasetDetails)
    store.dispatch('pages/datasets/datasetId/setDatasetFacetsData', datasetFacetsData)
    store.dispatch('pages/datasets/datasetId/setDatasetTypeName', datasetTypeName)

    return {
      tabs: tabsData,
      versions,
      datasetTypeName,
      downloadsSummary,
      showTombstone: propOr(false, 'isUnpublished', datasetDetails),
      errorMessages
    }
  },

  data() {
    return {
      showCopySuccess: false,
      isLoadingDataset: false,
      errorLoading: false,
      loadingMarkdown: false,
      associatedProjects: [],
      markdown: {},
      activeTabId: this.$route.query.datasetDetailsTab ? this.$route.query.datasetDetailsTab : 'abstract',
      datasetRecords: [],
      sparcAwardNumbers: [],
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
          label: 'Data & Models'
        }
      ],
      subtitles: [],
      errorMessages: [],
    }
  },

  async fetch() {
    const datasetOwnerId = propOr('', 'ownerId', this.datasetInfo)
    const datasetOwnerEmail = await this.$axios
      .$get(`${process.env.portal_api}/get_owner_email/${datasetOwnerId}`)
      .then(resp => {
        return resp.email
      })
      .catch(() => {
        return ''
      })

    if (this.datasetInfo)
      this.$store.dispatch('pages/datasets/datasetId/setDatasetInfo', { ...this.datasetInfo, 'ownerEmail': datasetOwnerEmail })
  },

  mounted() {
    this.$gtm.push({
      event: "",
      category: "",
      dataset_id: propOr(this.$route.params.datasetId, 'id', this.datasetInfo),
      version_id: propOr('', 'version', this.datasetInfo),
      doi: propOr('', 'doi', this.datasetInfo),
      event_name: "",
      citation_type: "",
      location: "",
      files: "",
      file_name: "",
      file_path: "",
      file_type: "",
    })
  },

  computed: {
    ...mapState('pages/datasets/datasetId', 
      ['datasetInfo', 'datasetFacetsData']
    ),
    defaultTab() {
      return this.tabs[0].id
    },
    /**
     * Compute if the dataset is the latest version
     * @returns {Boolean}
     */
    embargoAccess() {
      return propOr(null, 'embargoAccess', this.datasetInfo)
    },
    isLatestVersion() {
      if (this.versions !== undefined && this.versions.length) {
        const latestVersion = compose(propOr(1, 'version'), head)(this.versions)
        return this.datasetInfo.version === latestVersion
      }

      return true
    },
    /**
     * computes the text of the latest version and revision
     * @returns {String}
     */
    latestVersionRevision() {
      if (this.versions === undefined) {
        return ''
      }
      let revision = compose(propOr(0, 'revision'), head)(this.versions)
      let version = compose(propOr(1, 'version'), head)(this.versions)
      return `${version}.${revision}`
    },
    /**
     * computes the date of the latest version
     * @returns {String}
     */
    latestVersionDate() {
      if (this.versions === undefined) {
        return ''
      }
      let version = compose(head)(this.versions)
      const date = version.revisedAt || version.versionPublishedAt
      return this.formatDate(date)
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
     * Returns dataset owner email
     * @returns {String}
     */
    datasetOwnerEmail: function() {
      return this.datasetInfo.ownerEmail || ''
    },
    /**
     * Returns the dataset title
     * @returns {String}
     */
    datasetTitle: function() {
      return propOr('', 'name', this.datasetInfo)
    },
    /**
     * Url to get records for model
     * @returns {String}
     */
    getRecordsUrl: function() {
      return `${process.env.discover_api_host}/search/records?datasetId=${this.datasetId}`
    },
    /**
     * Returns the records in the protocol model for this dataset
     * @returns {String}
     */
    getProtocolRecordsUrl: function() {
      return `${this.getRecordsUrl}&model=protocol`
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
     * Return DOI link
     * @returns {String}
     */
    doiLink: function() {
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
      return `${process.env.discover_api_host}/datasets/${this.datasetId}`
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
    externalPublications: function() {
      return propOr([], 'externalPublications', this.datasetInfo)
    },
    primaryPublications: function() {
      const valObj = this.externalPublications.filter(function(elem) {
        return elem.relationshipType == 'IsDescribedBy'
      })
      return valObj.length > 0 ? valObj : null
    },
    associatedPublications: function() {
      const valObj = this.externalPublications.filter(function(elem) {
        return elem.relationshipType == 'IsReferencedBy' || elem.relationshipType == 'IsSupplementedBy'
      })
      return valObj.length > 0 ? valObj : null
    },
    hasCitations: function() {
      return (this.primaryPublications || this.associatedPublications) !== null
    },
    numCitations: function() {
      let numPrimary = this.primaryPublications ? this.primaryPublications.length : 0;
      let numAssociated = this.associatedPublications ? this.associatedPublications.length : 0;
      return numPrimary + numAssociated;
    },
    numDownloads: function() {
      let numDownloads = 0;
      this.downloadsSummary.filter(download => download.datasetId == this.datasetId).forEach(item => {
        numDownloads += item.downloads;
      })
      return numDownloads
    },
    hasFiles: function() {
      return this.fileCount >= 1
    },
    fileCount: function() {
      return propOr('0', 'fileCount', this.datasetInfo)
    },
    embargoed: function() {
      return propOr(false, 'embargo', this.datasetInfo)
    },
    canViewVersions: function() {
      return !this.embargoed
    }
  },

  watch: {
    '$route.query': 'queryChanged',
    /**
     * Watcher for getProtocolRecordsUrl
     */
    getProtocolRecordsUrl: {
      handler: function(val) {
        if (val) {
          this.getProtocolRecords()
        }
      },
      immediate: true
    },
    getRecordsUrl: {
      handler: function(val) {
        if (val) {
          this.getDatasetRecords()
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
    errorMessages: {
      handler: function() {
        //Non critical error messages
        this.errorMessages.forEach(message => {
          this.$message(failMessage(message))
        })
        //Clean up the error messages
        this.errorMessages.length = 0
      },
      immediate: true
    },
    hasFiles: {
      handler: function(newValue) {
        if (newValue) {
          const hasFilesTab = this.tabs.find(tab => tab.id === 'files') !== undefined
          if (!hasFilesTab) {
            this.tabs.splice(3, 0, { label: 'Files', id: 'files' })
          }
        }
      },
      immediate: true
    },
    hasCitations: {
      handler: function(newValue) {
        if (newValue) {
          const hasCitationsTab = this.tabs.find(tab => tab.id === 'references') !== undefined
          if (!hasCitationsTab) {
            this.tabs.splice(5, 0, { label: 'References', id: 'references' })
          }
        }
      },
      immediate: true
    },
    canViewVersions: {
      handler: function(newValue) {
        if (newValue) {
          const hasVersionsTab = this.tabs.find(tab => tab.id === 'versions') !== undefined
          if (!hasVersionsTab) {
            this.tabs.splice(6, 0, { label: 'Versions', id: 'versions' })
          }
        }
      },
      immediate: true
    },
  },
  methods: {
    tabChanged(newTab) {
      this.activeTabId = newTab.id
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
          .$get(this.getProtocolRecordsUrl)
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
     * Retrievs the metadata records for a dataset to get the sparc award number
     */
    getDatasetRecords: async function() {
      try {
        algoliaIndex
          .getObject(this.datasetId, {
            attributesToRetrieve: 'supportingAwards',
          })
          .then(( { supportingAwards } ) => {
            supportingAwards = supportingAwards.filter(award => propOr(null, 'identifier', award) != null)
            supportingAwards.forEach(award => {
              this.sparcAwardNumbers.push(`${award.identifier}`)
            })
          }).finally(async () => {
            if (this.sparcAwardNumbers.length > 0)
            {
              let projects = await getAssociatedProjects(this.sparcAwardNumbers)
              this.associatedProjects = projects.length > 0 ? projects : null
            }
          })
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * Set the active tab to match the current query values.
     */
    queryChanged: function() {
      this.activeTabId = this.$route.query.datasetDetailsTab
        ? this.$route.query.datasetDetailsTab
        : this.defaultTab
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
          name: 'DCTERMS.license',
          content: this.licenseLink
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.datasetTitle
        },
        {
          hid: 'description',
          name: 'description',
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
          content: this.doiLink,
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
        }
      ],
      script: [
        {
          vmid: 'ldjson-schema',
          json: {
            '@context': 'http://schema.org',
            '@type': 'Dataset',
            '@id': this.doiLink,
            sameAs: this.getDatasetUrl,
            name: this.datasetName,
            creator: creators,
            datePublished: this.datasetInfo.createdAt,
            dateModified: this.datasetInfo.revisedAt,
            description: this.datasetDescription,
            license: this.licenseLink,
            version: this.datasetInfo.version,
            url: process.env.ROOT_URL,
            citation: this.citationText,
            identifier: this.doiLink,
            isAccessibleForFree: true
          },
          type: 'application/ld+json'
        },
        {
          vmid: 'ldjson-schema',
          json: {
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            url: process.env.ROOT_URL,
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
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.left-column {
  @media (max-width: 47rem) {
    order: 1;
    margin-top: 0;
  }
}
::v-deep .details-tabs__container--data {
  padding-top: 0;
}
.dataset-details {
  background-color: $background;
  width: 100%;
  overflow-x: hidden;
}
</style>
