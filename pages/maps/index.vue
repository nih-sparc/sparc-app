<template>
  <div class="maps">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Maps</h1>
      <p>
        SPARC is creating detailed PNS maps based on SPARC data and information
        available from the literature. The maps you see here are not yet
        comprehensive and are largely derived from regions of the nervous system
        where SPARC data has been published on this site, supplemented in some
        regions by published knowledge of rat anatomy. New connectivity and
        species specificity in anatomy and connectivity will be added as the 
        SPARC program progresses.
      </p>
    </page-hero>
    <portal-features
      v-if="isLandingPage"
      :features="entries"
      title="What can I do with Maps?"
      :icon-is-top-element="false"
    />
    <div v-else ref="mappage" class="page-wrap portalmapcontainer">
      <client-only placeholder="Loading...">
        <div class="mapClass">
          <MapContent
            ref="map"
            :state="state"
            :starting-map="startingMap"
            :options="options"
            :share-link="shareLink"
            @updateShareLinkRequested="updateUUID"
            @isReady="mapMounted" 
          />
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import createAlgoliaClient from '@/plugins/algolia.js'

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'

import flatmaps from '@/services/flatmaps'
import scicrunch from '@/services/scicrunch'

import DatasetInfo from '@/mixins/dataset-info'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'

import PortalFeatures from '@/components/PortalFeatures/PortalFeatures.vue'

import { extractS3BucketName } from '@/utils/common'
import { successMessage, failMessage } from '@/utils/notification-messages'
import { getAlgoliaFacets, facetPropPathMapping } from '../data/utils'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)

const formatLabel = (text) => {
  if (text && (typeof text === 'string' || text instanceof String))
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  return text
}

const getScaffoldState = async (uuid, $axios) => {
  if (uuid) {
    let url = `${process.env.portal_api}/scaffold/getstate`
    return await $axios.$post(url, { uuid: uuid }).then((response) => response)
  }
}

const getScaffoldEntry = async (route, $axios, s3Bucket) => {
  //Check if file path from scicrunch can be found on the server
  const filePath = route.query.file_path
  let path = `${route.query.dataset_id}/${route.query.dataset_version}/${filePath}`
  if (s3Bucket) {
    path = path + `?s3BucketName=${s3Bucket}`
  }
  let result = await $axios
    .$get(`${process.env.portal_api}/exists/${path}`)
    .then(({ exists }) => {
      if (exists && exists !== 'false') {
        return {
          type: 'Scaffold',
          label: `Dataset ${route.query.dataset_id}`,
          url: `${process.env.portal_api}/s3-resource/${path}`,
          viewUrl: route.query.ViewURL,
        }
      } else {
        return undefined
      }
    })

  //Cannot be found using the file path from SciCrunch, use Pennsieve
  //instead
  if (!result) {
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      route.query.dataset_id,
      route.query.dataset_version
    )
    path = `${route.query.dataset_id}/${route.query.dataset_version}/${file.path}`
    if (s3Bucket) {
      path = path + `?s3BucketName=${s3Bucket}`
    }
    result = await $axios
      .$get(`${process.env.portal_api}/exists/${path}`, config)
      .then(({ exists }) => {
        if (exists && exists !== 'false') {
          return {
            type: 'Scaffold',
            label: `Dataset ${route.query.dataset_id}`,
            url: `${process.env.portal_api}/s3-resource/${path}`,
            viewUrl: route.query.ViewURL,
          }
        }
      })
  }
  //Finally check if an old id was used for storing the viewport.
  //If so, get it from the server
  if (result) {
    if (route.query.scaffoldid) {
      const state = await getScaffoldState(route.query.scaffoldid, $axios)
      result.state = state.state
    }
    return result
  }
}

export default {
  name: 'MapsPage',
  components: {
    Breadcrumb,
    PageHero,
    PortalFeatures,
    MapContent: process.client
      ? () =>
          import('@abi-software/mapintegratedvuer').then((m) => m.MapContent)
      : null,
  },
  mixins: [DatasetInfo],
  async fetch() {
    //First check if map should be restore from a provided id
    if (this.$route.query.id) {
      this.restoreStateWithUUID()
    } else {
      //Now check if it should open a specific view based on query
      this.openViewWithQuery()
    }
  },
  data() {
    return {
      resources: [],
      title: 'Maps',
      breadcrumb: [
        {
          to: {
            name: 'index',
          },
          label: 'Home',
        },
      ],
      currentEntry: undefined,
      organ_name: undefined,
      facets: [],
      uuid: undefined,
      startingMap: "AC",
      state: undefined,
      options: {
        sparcApi: process.env.portal_api,
        algoliaIndex: process.env.ALGOLIA_INDEX,
        algoliaKey: process.env.ALGOLIA_API_KEY,
        algoliaId: process.env.ALGOLIA_APP_ID,
        pennsieveApi: process.env.discover_api_host.replace('/discover', ''),
        flatmapAPI: process.env.flatmap_api,
        nlLinkPrefix: process.env.NL_LINK_PREFIX,
        rootUrl: process.env.ROOT_URL,
      },
      shareLink: `${process.env.ROOT_URL}${this.$route.fullPath}`,
      entries: [
        {
          fields: {
            buttonLink: 'maps?type=ac',
            buttonText: 'View AC Map',
            description:
              'The Anatomical Connectivity (AC) flatmaps show physical connectivity derived from SCKAN in an anatomical schematic context.',
            title: 'Anatomical Connectivity',
            icon: {
              fields: {
                file: {
                  url: require('~/assets/ac-map.png'),
                },
              },
            },
          },
        },
        {
          fields: {
            buttonLink: 'maps?type=fc',
            buttonText: 'View FC Map',
            description:
              'The Functional Connectivity (FC) flatmap provides a visualisation of semantic connectivity and a future interface to ANS models.',
            title: 'Functional Connectivity',
            icon: {
              fields: {
                file: {
                  url: require('~/assets/fc-map.png'),
                },
              },
            },
          },
        },
        {
          fields: {
            buttonLink: 'maps?type=wholebody',
            buttonText: 'View 3D Body',
            description:
              'The 3D whole-body shows physical connectivity derived from SCKAN in an anatomically realistic context.',
            title: '3D Whole Body',
            icon: {
              fields: {
                file: {
                  url: require('~/assets/3d-map.png'),
                },
              },
            },
          },
        },
      ],
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: 'SPARC is creating detailed PNS maps based on SPARC data and information available from the literature.'
        },
      ]
    }
  },
  watch: {
    currentEntry: 'currentEntryUpdated',
    facets: 'facetsUpdated',
  },
  fetchOnServer: false,
  created: function () {
    this.options.sparcApi = process.env.portal_api
    let lastChar = this.options.sparcApi.substr(-1)
    if (lastChar != '/') {
      this.options.sparcApi = this.options.sparcApi + '/'
    }
  },
  computed: {
    isLandingPage: function () {
      return Object.keys(this.$route.query).length === 0
    },
  },
  methods: {
    restoreStateWithUUID: async function () {
      //Restore settings from a saved state
      if (this.$route.query.id) {
        if (this.uuid != this.$route.query.id) {
          this.uuid = this.$route.query.id
          if (this.uuid) {
            await this.$axios
              .$post(`${process.env.portal_api}/map/getstate`, {
                uuid: this.uuid,
              })
              .then((response) => {
                if (response.state) {
                  this.state = response.state
                  this.$message(
                    successMessage(
                      `Saved state retrieved succesfuly, please wait while the state is being resumed.`
                    )
                  )
                }
              })
              .catch(() => {
                this.$message(
                  failMessage(
                    `Sorry! We can not retrieve the saved stated. Please check later or consider submitting a bug report.`
                  )
                )
              })
          }
        }
      }
    },
    updateUUID: function () {
      let url = this.options.sparcApi + `map/getshareid`
      let state = this.$refs.map.getState()
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ state: state }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.uuid = data.uuid
          this.$router.replace({ query: { id: data.uuid } }, () => {
            this.shareLink = `${process.env.ROOT_URL}${this.$route.fullPath}`
          })
        })
    },
    checkSpecies: function () {
      //Display error message if species information is missing or cannot be found
      //Old link may contain the for_species as undefined
      if (this.currentEntry.type === 'MultiFlatmap') {
        if (
          this.$route.query.for_species &&
          this.$route.query.for_species !== 'undefined'
        ) {
          if (
            this.$route.query.for_species !==
            flatmaps.speciesMap[this.currentEntry.taxo]
          ) {
            this.$message(
              failMessage(
                `Sorry! A flatmap for a ${this.forSpecies} does not yet exist. The ${this.organ_name} of a rat has been shown instead.`
              )
            )
          }
        } else if (this.$route.query.fid) {
          this.$message(
            successMessage(
              `A flatmap's unique id is provided, a legacy map may be displayed instead.`
            )
          )
        } else {
          this.$message(
            failMessage(
              `Sorry! Species information cannot be found. The ${this.currentEntry.organ} of a rat has been shown instead.`
            )
          )
        }
      }
    },
    updateFacets: async function(dataset_id) {
      //Create the array of facets to pass onto the sidebar
      const filter = `objectID:${dataset_id}`
      const facets = await getAlgoliaFacets(algoliaIndex, facetPropPathMapping, filter).then(data => {
        return data
      });
      facets.forEach(facet => {
        if (facet.key && facet.key === 'anatomy.organ.name' ||
        facet.key === 'organisms.primary.species.name') {
          let term = formatLabel(facet.label);
          facet.children.forEach(child => {
            this.facets.push({
              facet: formatLabel(child.label),
              term: term,
              facetPropPath: facet.key,
            });
          });
        }
      });
    },
    //Process any taxon or anatomy parameters if they are available
    processEntry: async function(route) {
      //anatomy and taxon query parameters should be replaced taxo 
      //and uberonid.
      const anatomy = route.query.anatomy ? route.query.anatomy : route.query.uberonid
      const taxon = route.query.taxon ? route.query.taxon : route.query.taxo
      if (anatomy || taxon) {
        //Specify the gender of human
        let biologicalSex = route.query.biologicalSex
        if (taxon && taxon === 'NCBITaxon:9606') {
          if (!biologicalSex) {
            biologicalSex = 'PATO:0000384'
          }
        }
        try {
          this.organ_name = await scicrunch.getOrganFromUberonId(anatomy)
          //We do not want to display the body proper
          if (this.organ_name && this.organ_name.toLowerCase() === 'body proper') {
            anatomy = undefined
          }
        } catch (e) {
          // Error caught return empty data.
        }
        if (this.$route.query.type === 'ac' || this.$route.query.type === 'flatmap') {
          this.currentEntry = {
            type: 'MultiFlatmap',
            taxo: taxon,
            biologicalSex: biologicalSex,
            uuid: route.query.fid,
            organ: anatomy,
          }
          this.checkSpecies()
          return
        }
        if (this.$route.query.type === 'fc' && anatomy) {
          this.currentEntry = {
            type: 'Flatmap',
            resource: 'FunctionalConnectivity',
            label: 'Functional',
            state: {searchTerm: anatomy}
          }
          return
        }
      }
      if (this.$route.query.type === 'ac' || this.$route.query.type === 'flatmap') {
        this.startingType = "AC"
        return
      }
      if (this.$route.query.type === 'fc') {
        this.startingMap = "FC"
        return
      }
    },
    openViewWithQuery: async function () {
      //Open the map with specific view defined by the query.
      //First get the bucket and facets information if available
      let s3Bucket = undefined

      if (this.$route.query.dataset_id && this.$route.query.dataset_version) {
        const datasetInfo = await this.getDatasetInfo(
          this.$axios,
          this.$route.query.dataset_id,
          this.$route.query.dataset_version,
          this.$cookies.get('user-token')
        )
        s3Bucket = datasetInfo
          ? extractS3BucketName(datasetInfo.uri)
          : undefined
        await this.updateFacets(this.$route.query.dataset_id)
      }
      //Get the entry information if we are not opening with the default settings or
      //resuming from previous saved state
      if (this.$route.query.type === 'scaffold') {
        this.currentEntry = await getScaffoldEntry(
          this.$route,
          this.$axios,
          s3Bucket
        )
        if (!this.currentEntry) {
          this.$message(
            failMessage(
              `Sorry! The specified scaffold cannot be found. Please check later or consider submitting a bug report.`
            )
          )
        }
      } else if (this.$route.query.type === 'fc' || 
        this.$route.query.type === 'ac' || 
        this.$route.query.type === 'flatmap') {
        await this.processEntry(this.$route)
      } else if (this.$route.query.type === 'wholebody') {
        this.startingMap = "WholeBody"
      }
    },
    facetsUpdated: function () {
      if (this.facets.length > 0 && this.$refs.map) this.$refs.map.openSearch(this.facets, "")
    },
    currentEntryUpdated: function () {
      if (this.$refs.map && this.currentEntry) {
        this.$refs.map.setCurrentEntry(this.currentEntry)
      }
    },
    mapMounted: function () {
      this.currentEntryUpdated()
      this.facetsUpdated()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.maps {
  background-color: #f5f7fa;

  .portalmapcontainer {
    margin-top: 1.5rem;
    height: 90vh;
    max-width: calc(100% - 48px);
    padding-left: 24px;
  }

  .page-wrap {
    &__results {
      font-size: 0.875em;
      font-weight: normal;
      line-height: 1em;

      @media screen and (max-width: 768px) {
        margin-left: 0.9375rem;
      }

      p {
        margin-top: 1.5rem;
      }
    }
    @media (min-width: 48em) {
      padding-top: 0;
    }
  }
}
</style>
<style lang="scss">
@import '@/assets/_variables.scss';

.mapClass {
  position: relative;
  width: 100%;
  height: 100%;
  border: solid 1px #dcdfe6;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
  @import '~@abi-software/mapintegratedvuer/dist/mapintegratedvuer';

  .map-icon {
    color: #8300bf!important;
  }


  .pathway-container {
    .container {
      padding-left: 0px;
    }
  }

  .el-popover.right-popper {
    .popper__arrow {
      border-top-color:transparent!important;
      border-bottom-color:transparent!important;
    }
  }
}

.gallery-popper {
  background: #f3ecf6 !important;
  border: 1px solid #8300bf;
  border-radius: 4px;
  color: #303133 !important;
  font-size: 12px;
  line-height: 1rem;
  height: 1rem;
  padding: 10px;
  &.el-popper[x-placement^='top'] {
    .popper__arrow {
      border-top-color: #8300bf !important;
    }
    .popper__arrow:after {
      border-top-color: #f3ecf6 !important;
    }
  }
}
</style>

<style
  src="@abi-software/mapintegratedvuer/assets/mapicon-species-style.css"
></style>
