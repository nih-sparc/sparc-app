<template>
  <div class="maps">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Maps</h1>
      <p>
        SPARC is creating detailed PNS maps based on SPARC data and information
        available from the literature. The flatmaps you see here are not yet
        comprehensive and are largely derived from regions of the nervous system
        where SPARC data has been published on this site, supplemented in some regions
        by published knowledge of rat anatomy. New connectivity and species
        specificity will be added as the SPARC program progresses.
      </p>
    </page-hero>
    <div ref="mappage" class="page-wrap portalmapcontainer">
      <client-only placeholder="Loading...">
        <div class="mapClass">
          <MapContent
            ref="map"
            :state="state"
            :options="options"
            :share-link="shareLink"
            @updateShareLinkRequested="updateUUID"
            @hook:mounted="mapMounted"
          />
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import flatmaps from '@/services/flatmaps'
import PageHero from '@/components/PageHero/PageHero.vue'
import scicrunch from '@/services/scicrunch'

import { successMessage, failMessage } from '@/utils/notification-messages'

const getFlatmapEntry = async ( route ) => {
  const uberonid = route.query.uberonid
  let organ_name = undefined
  //Specify the gender of human
  let biologicalSex = route.query.biologicalSex
  if (route.query.taxo && route.query.taxo === "NCBITaxon:9606") {
    if (!biologicalSex)
      biologicalSex = "PATO:0000384"
  }
  try {
    organ_name = await scicrunch.getOrganFromUberonId(uberonid)
    //We do not want to display the body proper
    if (organ_name && organ_name.toLowerCase() === "body proper")
      organ_name = undefined
  } catch (e) {
    // Error caught return empty data.
  }

  return {
      type: "MultiFlatmap",
      taxo: route.query.taxo,
      biologicalSex: biologicalSex,
      uuid: route.query.fid,
      organ: organ_name
  }
}

const getScaffoldState = async( uuid, $axios ) => {
  if (uuid) {
    let url = `${process.env.portal_api}/scaffold/getstate`
    return await $axios.$post(url, { uuid: uuid })
      .then(response => response)
  }
}

const getScaffoldEntry = async ( route, $axios ) => {
  //Check if file path from scicrunch can be found on the server
  const filePath = route.query.file_path
  let path = `${route.query.dataset_id}/${route.query.dataset_version}/${filePath}`
  let result = await $axios.$get(`${process.env.portal_api}/exists/${path}`).then(({ exists }) => {
    if (exists && exists !== "false") {
      return {
        type: "Scaffold",
        label: `Dataset ${route.query.dataset_id}`,
        url: `${process.env.portal_api}/s3-resource/${path}`,
        viewUrl: route.query.ViewURL
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
      route.query.dataset_version,
    )
    path = `${route.query.dataset_id}/${route.query.dataset_version}/${file.path}`
    result = await $axios.$get(`${process.env.portal_api}/exists/${path}`).then(({ exists }) => {
      if (exists && exists !== "false") {
        return {
          type: "Scaffold",
          label: `Dataset ${route.query.dataset_id}`,
          url: `${process.env.portal_api}/s3-resource/${path}`,
          viewUrl: route.query.ViewURL
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
    MapContent: process.client
      ? () => import('@abi-software/mapintegratedvuer').then(m => m.MapContent)
      : null
  },
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
            name: 'index'
          },
          label: 'Home'
        }
      ],
      currentEntry: undefined,
      doi: undefined,
      uuid: undefined,
      state: undefined,
      options:{
        sparcApi: process.env.portal_api,
        algoliaIndex: process.env.ALGOLIA_INDEX,
        algoliaKey: process.env.ALGOLIA_API_KEY,
        algoliaId: process.env.ALGOLIA_APP_ID,
        pennsieveApi: (process.env.discover_api_host).replace('/discover', ''),
        flatmapAPI: process.env.flatmap_api,
        nlLinkPrefix: process.env.NL_LINK_PREFIX,
        rootUrl: process.env.ROOT_URL,
      },
      shareLink: `${process.env.ROOT_URL}${this.$route.fullPath}`
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  watch: {
    currentEntry: "currentEntryUpdated",
    doi: "doiUpdated"
  },
  fetchOnServer: false,
  created: function() {
    this.options.sparcApi = process.env.portal_api
    let lastChar = this.options.sparcApi.substr(-1)
    if (lastChar != '/') {
      this.options.sparcApi = this.options.sparcApi + '/'
    }
  },
  methods: {
    restoreStateWithUUID: async function() {
      //Restore settings from a saved state
      if (this.$route.query.id) {
        if (this.uuid != this.$route.query.id) {
          this.uuid = this.$route.query.id
          if (this.uuid) {
            await this.$axios.$post(`${process.env.portal_api}/map/getstate`, { uuid: this.uuid })
            .then((response) => {
              if (response.state) {
                this.state = response.state
                this.$message(successMessage(
                  `Saved state retrieved succesfuly, please wait while the state is being resumed.`
              ))
              }
            })
            .catch(() => {
              this.$message(failMessage(
                `Sorry! We can not retrieve the saved stated. Please check later or consider submitting a bug report.`
              ))
            })
          }
        }
      }
    },
    updateUUID: function() {
      let url = this.options.sparcApi + `map/getshareid`
      let state = this.$refs.map.getState()
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ state: state })
      })
      .then(response => response.json())
      .then(data => {
        this.uuid = data.uuid
        this.$router.replace(
          { query: { id: data.uuid } },
          () => {
            this.shareLink = `${process.env.ROOT_URL}${this.$route.fullPath}`
          }
        )
      })
    },
    checkSpecies: function() {
      //Display error message if species information is missing or cannot be found
      //Old link may contain the for_species as undefined
      if (this.currentEntry.type === "MultiFlatmap") {
        if (this.$route.query.for_species &&
        this.$route.query.for_species !== "undefined") {
          if (this.$route.query.for_species !== flatmaps.speciesMap[this.currentEntry.taxo]) {
            this.$message(failMessage(
              `Sorry! A flatmap for a ${this.forSpecies} does not yet exist. The ${this.organ} of a rat has been shown instead.`
            ))
          }
        } else if (this.$route.query.fid) {
          this.$message(successMessage(
            `A flatmap's unique id is provided, a legacy map may be displayed instead.`
          ))
        } else {
          this.$message(failMessage(
            `Sorry! Species information cannot be found. The ${this.currentEntry.organ} of a rat has been shown instead.`
          ))
        }
      }
    },
    openViewWithQuery: async function() {
      //Open the map with specific view defined by the query.
      //First get the DOI information if available
      if (this.$route.query.dataset_id && this.$route.query.dataset_version) {
        const url = `${process.env.discover_api_host}/datasets/${this.$route.query.dataset_id}`
        let datasetUrl = this.$route.query.dataset_version ? `${url}/versions/${this.$route.query.dataset_version}` : url
        const userToken = this.$cookies.get('user-token')
        if (userToken) {
          datasetUrl += `?api_key=${userToken}`
        }
        const datasetInfo = await this.$axios.$get(datasetUrl).catch(error => {
          console.log(`Could not get the dataset's info: ${error}`)
        })
        this.doi = datasetInfo ? datasetInfo.doi : undefined;
      }
      //Get the entry information if we are not opening with the default settings or
      //resuming from previous saved state
      if (this.$route.query.type === "scaffold") {
        this.currentEntry = await getScaffoldEntry( this.$route, this.$axios )
        if (!this.currentEntry) {
          this.$message(failMessage(
            `Sorry! The specified scaffold cannot be found. Please check later or consider submitting a bug report.`
          ))
        }
      } else if (this.$route.query.type === "flatmap") {
        this.currentEntry = await getFlatmapEntry( this.$route )
        //Check species information
        this.checkSpecies()
      }
    },
    doiUpdated: function() {
      if (this.doi && this.$refs.map)
        this.$refs.map.openSearch([], this.doi)
    },
    currentEntryUpdated: function() {
      if (this.$refs.map && this.currentEntry) {
        this.$refs.map.setCurrentEntry(this.currentEntry)
      }
    },
    mapMounted: function() {
      this.currentEntryUpdated()
      this.doiUpdated()
    }
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
.mapClass {
  position: relative;
  width: 100%;
  height: 100%;
  border: solid 1px #dcdfe6;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
  @import '~@abi-software/mapintegratedvuer/dist/mapintegratedvuer';
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
