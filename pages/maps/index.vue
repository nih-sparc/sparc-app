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

import { failMessage } from '@/utils/notification-messages'

const getFlatmapEntry = async ( route ) => {
  const uberonid = route.query.uberonid
  let organ_name = undefined
  try {
    organ_name = await scicrunch.getOrganFromUberonId(uberonid)
  } catch (e) {
    // Error caught return empty data.
  }

  return {
      type: "MultiFlatmap",
      taxo: route.query.taxo,
      biologicalSex: route.query.biologicalSex,
      organ: organ_name
  }
}

const getScaffoldEntry = async ( error, route, $axios ) => {
  //Check if file path from scicrunch can be found on the server
  const filePath = route.query.file_path
  let path = `${route.query.dataset_id}/${route.query.dataset_version}/${filePath}`
  const result = await $axios.$get(`${process.env.portal_api}/exists/${path}`).then(({ exists }) => {
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
  if (result) return result;

  //Cannot be found using the file path from SciCrunch, use Pennsieve
  //instead
  const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
    $axios,
    filePath,
    route.query.dataset_id,
    route.query.dataset_version,
  )
  path = `${route.query.dataset_id}/${route.query.dataset_version}/${file.path}`
  return await $axios.$get(`${process.env.portal_api}/exists/${path}`).then(({ exists }) => {
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
    if (this.$route.query.id) {
      if (this.uuid != this.$route.query.id) {
        this.uuid = this.$route.query.id
        if (this.uuid) {
          let url = this.options.sparcApi + `map/getstate`
          await fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ uuid: this.uuid })
          })
            .then(response => response.json())
            .then(data => {
              this.state = data.state
            })
        }
      }
    }
  },
  async asyncData({ app, route, error, $axios }) {
    //Id is processed using the fetch above
    if (!route.query.id) {
      //Get the DOI information if available
      let doi = undefined;
      if (route.query.dataset_id && route.query.dataset_version) {
        const url = `${process.env.discover_api_host}/datasets/${route.query.dataset_id}`
        let datasetUrl = route.query.dataset_version ? `${url}/versions/${route.query.dataset_version}` : url
        const userToken = app.$cookies.get('user-token')
        if (userToken) {
          datasetUrl += `?api_key=${userToken}`
        }
        const datasetInfo = await $axios.$get(datasetUrl).catch(error => {
          console.log(`Could not get the dataset's info: ${error}`)
        })
        doi = datasetInfo ? datasetInfo.doi : undefined;
      }
      //Get the entry information if we are not opening with the default settings or
      //resuming from previous saved state
      let currentEntry = undefined;
      if (route.query.type === "scaffold") {
        currentEntry = await getScaffoldEntry(error, route, $axios)
      } else if (route.query.type === "flatmap") {
        currentEntry = await getFlatmapEntry( route )
      }
      return { currentEntry, doi }
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
    '$route.query.id': '$fetch'
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
          { query: { ...this.$route.query, id: data.uuid } },
          () => {
            this.shareLink = `${process.env.ROOT_URL}${this.$route.fullPath}`
          }
        )
      })
    },
    checkScaffold: function() {
      if (this.$route.query.type === "scaffold" && !this.currentEntry) {
        this.$message(failMessage(
          `Sorry! The specified scaffold cannot be found. Please check later or consider submitting a bug report.`
        ))
      }
    },
    checkSpecies: function() {
      //Display error message if species information is missing or cannot be found
      if (this.currentEntry.type === "MultiFlatmap") {
        if (this.$route.query.for_species) {
          if (this.$route.query.forSpecies !== flatmaps.speciesMap[this.currentEntry.taxo]) {
            this.$message(failMessage(
              `Sorry! A flatmap for a ${this.forSpecies} does not yet exist. The ${this.organ} of a rat has been shown instead.`
            ))
          }
        } else {
          this.$message(failMessage(
            `Sorry! Species information cannot be found. The ${this.organ} of a rat has been shown instead.`
          ))
        }
      }
    },
    mapMounted: function() {
      //Set the starting view using the currentEntry information
      if (this.currentEntry) {
        this.$refs.map.setCurrentEntry(this.currentEntry)
        this.checkSpecies()
        //Only use the doi information  if there is a set default view
        if (this.doi)
          this.$refs.map.openSearch([], this.doi)
      } else {
        //No entry but check if it is attempting to display a scaffold
        this.checkScaffold()
      }
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
