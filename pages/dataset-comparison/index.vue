<template>
  <div class="dataset-comparison-page">
    <breadcrumb :breadcrumb="breadcrumb" title="KnowMore" />
    <div class="container">
      <div class="search-tabs__container" style="text-align: center;">
        <img :src="knowmorelogo" style="width:35%"/> 
        <h4 style="text-align: center">
          Say "no more" to manual discovery across SPARC datasets
        </h4>
        <h5 style="text-align: center; padding-top: 30px">
          Visit our GitHub repositery for the documentation 
          <a href="https://github.com/SPARC-FAIR-Codeathon/KnowMore"> <img :src="githublogo" style="width:24px; padding-left: 10px"/> </a>
        </h5>

      </div>
      <div class="search-bar__container">
        <h5 style="padding-bottom: 10px; padding-left: 9px;">
          Add datasets to analyze
        </h5>
        <div class="add-ds-form" @keyup.enter="$emit('search')">
          <div class="input-wrap">
            <input 
              @keyup.enter="addDataset" 
              v-model="toAddPreview"
              v-on:input="loadPreview"
              placeholder="Dataset ID (e.g., 156 or 157)"
              class="add-ds-field"
            />
          </div>
          <el-button class="btn-submit-search" :disabled="!previewData || previewData.error" @click="addDataset">
            <span>
              Add
            </span>
          </el-button>
        </div>
        <div v-loading="isLoadingDatasetPreview" class="is-loading">
          <div v-if="previewData" @click="addDataset" :class="{previewText: !previewData.error}">
            {{previewData.error ? "(No dataset found with id: " + toAddPreview + ")" : previewData.name}}
          </div>
        </div>
          
      </div>
    </div>
    <div class="page-wrap container">
      <el-row :gutter="32" type="flex">
        <el-col :span="24">
          <div class="mb-16">
            <div class="active__filter__wrap">
              <div
                v-for="(filter, filterIdx) in filters"
                :key="filter.category"
                class="active__filter__wrap-category"
              >
                <template v-for="(item, itemIdx) in filter.filters">
                  <el-tag
                    v-if="item.value"
                    :key="`${item.key}`"
                    closable
                    @close="clearFilter(filterIdx, itemIdx)"
                  >
                    {{ item.label }}
                  </el-tag>
                </template>
              </div>
            </div>
          </div>
          <el-row :gutter="32">
            <el-col
              :sm="24"
              :md="6"
              :lg="4"
            >
              <div class="dataset-filters table-wrap">
                <h2>Toggle Visualizations: </h2>
                <div class="dataset-filters__filter-group">
                  <el-checkbox-group
                    v-model="datasetFilters"
                    @change="setDatasetFilter"
                  >
                    <div
                      v-for="discoveryDataType in discoveryDataTypes"  
                    >
                      <el-checkbox 
                        :label="discoveryDataType.label" 
                        :disabled="discoveryDataType.disabled"
                      />
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </el-col>
            <el-col
              :sm="24"
              :md="18"
              :lg="20"
            >
              <div
                v-if="datasetsToCompare.length > 0"
              >
                <h3>Datasets Ready for Discovery:</h3>
                <el-row type="flex" v-for="dataset in datasetsToCompare" :key="dataset.text" class="dataset-row">
                  <div>
                    <svg-icon
                      name="icon-clear"
                      stroke="red"
                      color="#909399 #fff"
                      height="22"
                      width="22"
                      @click="removeDataset(dataset)"
                    />
                    <span>{{ dataset.name }} (id: {{ dataset.id }})  </span>
                  </div>
                  <img
                    class="dataset-preview-img"
                    v-bind:src="dataset.banner"
                  />
                </el-row>
                <el-button 
                  class="btn-submit-knowmore" 
                  @click="compareDatasets"
                  :disabled="datasetsToCompare.length == 0"
                >
                  <span>
                    Discover
                  </span>
                </el-button>
              </div>
            </el-col>
            <br />
          </el-row>

          <el-row :gutter="32">
            <el-col
              :sm="searchColSpan('sm')"
              :md="searchColSpan('md')"
              :lg="searchColSpan('lg')"
            >
              <h2 class="results-header">Results</h2>
              <div class="source-datasets-for-results">
                <h4>Currently showing results for: </h4>
                <div v-if="datasetsCurrentlyBeingCompared.length == 0" class="">
                  (None Selected)
                </div>
                <div v-if="datasetsCurrentlyBeingCompared.length > 0" class="">
                  <div v-for="ds in datasetsCurrentlyBeingCompared" class="">
                    - {{ ds.name }}
                  </div>
                </div>
              </div>
              <br />

              <div v-if="datasetsCurrentlyBeingCompared.length > 0" v-for="discoveryDataType in discoveryDataTypes" class="">
                <dataset-discovery-visualization-wrapper 
                   v-if="!discoveryDataType.disabled && activeDiscoveryDataTypes.includes(discoveryDataType.type)"
                   :visualizationType="discoveryDataType"
                   :datasetsInfo="datasetsCurrentlyBeingCompared"
                   :isVegaLoaded="isVegaLoaded"
                   :isPlotlyLoaded="isPlotlyLoaded"
                   :isVegaEmbedLoaded="isVegaEmbedLoaded"
                   :isMatlabJobFinished="isMatlabJobFinished"
                />
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>

import knowmorelogo from "../../assets/knowmore-logo.png"
import githublogo from "../../assets/GitHub-Mark-64px.png"
    
import {
  assocPath,
  clone,
  compose,
  defaultTo,
  equals,
  flatten,
  find,
  filter,
  head,
  mergeLeft,
  pathOr,
  propEq,
  propOr,
  pluck
} from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import DatasetDiscoveryVisualizationWrapper from '@/components/DatasetDiscoveryVisualization/DatasetDiscoveryVisualizationWrapper.vue'


const discoveryDataTypes = [
  // shows up first, so show on top
  {
    label: 'Knowledge Graph',
    type: 'graph',
    disabled: false,
  },
  {
    label: 'Abstract',
    type: 'abstract',
    notChart: true,
    requiresOsparcJob: true,
    disabled: false,
  },
  {
    label: 'Common Keywords',
    type: 'nlp',
    requiresOsparcJob: true,
    disabled: false,
  },
  {
    label: 'Summary Table',
    type: 'summaryTable',
    requiresOsparcJob: true,
    disabled: false,
  },
  {
    label: 'Image Clustering',
    type: 'imageCluster',
    requiresOsparcJob: true,
    disabled: false,
  },
  {
    label: 'Data Correlation',
    type: 'tabularDataClustering',
    requiresOsparcJob: true,
    disabled: false,
  },
]

const searchData = {
  limit: 10,
  skip: 0,
  items: [],
  order: undefined,
  ascending: false
}

// actually using labels for now, easy for using with the checkboxes and vue models
const datasetFilters = discoveryDataTypes.map(type => type.label)

import createClient from '@/plugins/contentful.js'

const client = createClient()



export default {

  name: 'DatasetComparisonPage',

  head () {
    return {
      script: [
        { 
          src: "https://cdn.jsdelivr.net/npm/vega@5",
          // for using hid and callback
          // https://github.com/nuxt/nuxt.js/issues/5052#issuecomment-663629000
          hid: 'vega',
          callback: () => { 
            this.isVegaLoaded = true 
            console.log("loaded vega")
          },
        },
        { 
          src: "https://cdn.jsdelivr.net/npm/vega-embed@6",
          hid: 'vegaEmbed',
          callback: () => { 
            this.isVegaEmbedLoaded = true 
            console.log("loaded vega embed")
          },
        },
        { 
          src: "https://cdn.plot.ly/plotly-2.2.0.min.js",
          hid: 'plotly',
          callback: () => { 
            this.isPlotlyLoaded = true 
            console.log("loaded plotly")
          },
        },
      ]
    }
  },

  components: {
    Breadcrumb,
    PageHero,
    DatasetDiscoveryVisualizationWrapper,
  },

  mixins: [],

  data: () => {

    return {
      knowmorelogo: knowmorelogo,
      githublogo: githublogo,
      searchQuery: '',
      filters: [],
      discoveryDataTypes,
      previewData: null,
      searchData: clone(searchData),
      isLoadingDatasetPreview: false,
      isLoadingComparison: false,
      // start with all types active
      activeDiscoveryDataTypes: discoveryDataTypes.map((dt) => (dt.type)),
      // preview string (currently just using string) of dataset whose id user selected
      toAddPreview: "",

      // make sure to not to try to render vega/plotly until loaded
      isVegaLoaded: false,
      isVegaEmbedLoaded: false, 
      isPlotlyLoaded: false,

      // whether we need to keep polling osparc for data or not
      //pollingPythonOsparcJob: false,
      //pollingMatlabOsparcJob: false,

      // if the matlab osparc job successfully completed
      isMatlabJobFinished: false,

      osparcJobID: null,

      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      titleColumnWidth: 300,
      windowWidth: '',
      datasetFilters: [...datasetFilters],
    }
  },

  computed: {
    /**
    * datasets that are queued up to be compared when they click the button, OR when component first mounts
    *
    */
    datasetsToCompare: function() {
      const toCompare = this.$store.state.datasetComparison.toCompare

      const modified = toCompare.map(function (dataset) {
        // TODO consider getting dynamically, perhaps using e.g., https://api.pennsieve.io/discover/datasets?limit=10&offset=0&ids=156&orderBy=relevance&orderDirection=desc
        const fieldsToAdd = {imageUrl: "https://assets.discover.pennsieve.io/dataset-assets/" + dataset.id + "/1/banner.jpg"}
        
        return Object.assign(dataset, fieldsToAdd)
      })

      return modified
    },


    /**
    * datasets that were compared when they last clicked the button
    - initializes from the store
    - after that, waits for the user to press "discover" to sync with the store
    *
    */
    datasetsCurrentlyBeingCompared: function () {
      return this.lastJobRun.datasetIds || []
    },

    lastJobRun: function () {
      const lastJobRun = this.$store.state.datasetComparison.lastJobRun
      return lastJobRun
    },

    // job id of last matlab osparc job run
    matlabOsparcJobID: function () {
      // sometimes will be undefined
      return this.lastJobRun.matlabOsparcJobID
    },

    // job id of last python osparc job run
    pythonOsparcJobID: function () {
      // sometimes will be undefined
      return this.lastJobRun.pythonOsparcJobID
    },

    /**
     * list of datasets we are comparing
     * NOTE not currently in use, but I think this should return all data
     * @returns {Array}
     */
    tableData: function() {
      //return propOr([], 'items', this.searchData)
      return propOr([], this.$store.state.datasetComparison.toCompare)
    },

    q: function() {
      return this.$route.query.q || ''
    },

    /**
     * True if user is on a small screen (mobile)
     * @returns {Boolean}
     */
    isMobile: function() {
      return this.windowWidth <= 500
    }
  },

  beforeMount: function() {
    this.windowWidth = window.innerWidth

    // on mount, DON'T intialize what we compare using what was calculated from te store
    //this.datasetsCurrentlyBeingCompared = clone(this.datasetsToCompare)
  },

  /**
   * Check the discoveryDataType param in the route and set it if it doesn't exist
   * Shrink the title column width if on mobile
   */
  mounted: function() {
    // if (!this.$route.query.type) {
    //   const firstTabType = compose(propOr('', 'type'), head)(discoveryDataTypes)

    //   this.$router.replace({ query: { type: firstTabType } })
    // } else {
    //   /**
    //    * Set the searchData from query params
    //    * Need to convert skip and limit from strings to numbers
    //    */
    //   const queryParams = {
    //     skip: Number(this.$route.query.skip || searchData.skip),
    //     limit: Number(this.$route.query.limit || searchData.limit),
    //     q: this.$route.query.q || ''
    //   }

    //   this.searchData = { ...this.searchData, ...queryParams }

    //   if (this.$route.query.datasetFilters) {
    //     this.datasetFilters = Array.isArray(this.$route.query.datasetFilters)
    //       ? this.$route.query.datasetFilters
    //       : [this.$route.query.datasetFilters]
    //   }
    // }
    if (window.innerWidth <= 768) this.titleColumnWidth = 150
    window.onresize = () => this.onResize(window.innerWidth)
  },

  methods: {
    // add a dataset from the form to the compare list
    async compareDatasets (e) {
      // sets the records queued up to compare to this component's state, which gets sent to child props, and ultimately triggers their handlers
      console.log("this will compare the datasets")

      // this also triggers an asyncronous action, but don't need to wait for it. Let it be...asynchronous
      this.$store.commit('datasetComparison/setLastJobRan', {
        datasetIds: clone(this.datasetsToCompare)
      })


      try {
        // also want to send here the massive osparc query kickoff function
        const apiUrl = `${process.env.flask_api_host}/api/start-osparc-job/`

        const datasetIds = this.datasetsCurrentlyBeingCompared.map(ds => ds.id)
        const { data } = await this.$axios.post(apiUrl, {
          datasetIds,
        })
        console.log("results from creating job in osparc", data)

        const newState = Object.assign({}, clone(this.lastJobRun))
        newState.pythonOsparcJobID = data["job_id"]
        this.$store.commit('datasetComparison/setLastJobRan', newState)

        // not waiting for this, just set and forget
        this.pollPythonOsparcUntilComplete()

      } catch (err) {
        console.error(err)
      }
    },

    async pollPythonOsparcUntilComplete () {
      // first do the python job
      const pythonJobResult = await this.pollOsparcUntilComplete("python")

      // then do the matlab job
      const newState = Object.assign({}, clone(this.lastJobRun))
      newState.matlabOsparcJobID = pythonJobResult["matlab_job_id"]
      this.$store.commit('datasetComparison/setLastJobRan', newState)

      // then start polling the matlab job using the job id we get back
      const matlabJobResult = await this.pollMatlabOsparcUntilComplete()

    },

    async pollMatlabOsparcUntilComplete () {
      if (!this.matlabOsparcJobID) {
        console.log("no matlab job id...something went wrong here")
        return
      }

      await this.pollOsparcUntilComplete("matlab")
    },
    
    
    // this is async so you just call once and let it run forever. don't actually watch it...
    async pollOsparcUntilComplete (jobType) {
      let consecutiveFailures = 0

      let done = false
      let result

      while (!done) {
        try {
          [result, done] = await this.pollOsparc(jobType)

          // sleep 30s 
          const sleepSeconds = 3
          await new Promise(resolve => setTimeout(resolve, sleepSeconds * 1000))

          // return result, if there is one

        } catch (err) { 
          console.error(err)
          consecutiveFailures = consecutiveFailures +1

          if (consecutiveFailures > 50) {
            // just give up here
            console.log("giving up on job", jobId)

            throw err
          } else {
            console.log("retrying", jobId)

          }
        }
      }


      return result
    },

    async pollOsparc (jobType) {
      const osparcJobID = jobType == "python" ? this.pythonOsparcJobID : this.matlabOsparcJobID

      const url = `${process.env.flask_api_host}/api/check-osparc-job/${jobType}/${osparcJobID}`

      const { data } = await this.$axios.get(url)
      console.log("results from polling osparc", data, "for job type", jobType)

     
      let done
      if (data.finished) {
        done = true


        if (data.success) {
          if (jobType == "python") {
            this.$store.commit('datasetComparison/setOsparcResults', data)
          } else if (jobType == "matlab") {

            // TODO probably better to just put on vue store
            this.isMatlabJobFinished = true
          }
        } else {
          // finished...but failed
        }


      } else {
        done = false
      }

      return [data, done]
    },

    addDataset (e) {
      if (!this.previewData || this.previewData.error) {
        console.log("not adding nothing")

        return
      }

      const datasetId = this.toAddPreview
      const details = this.previewData
      console.log("ds details: ", details)

      const toCompare = this.$store.state.datasetComparison.toCompare

      // check if we already have this one to avoids dupes
      if (!toCompare.some(ds => ds.id === details.id)) { 
        this.$store.commit('datasetComparison/add', details)
      }

      // clear the field
      this.toAddPreview = ""
      this.previewData = null
    },

    async loadPreview (e) {
      const datasetId = e.target.value
      if (datasetId == "") {
        this.previewData = null
        // don't display anything
        return null
      }

      this.isLoadingDatasetPreview = true
      const details = await this.getDatasetDetails(datasetId)

      this.previewData = details
      this.isLoadingDatasetPreview = false
    },


    removeDataset (dataset, e) {
      const details = dataset
      console.log("ds we're going to remove: ", details)

      this.$store.commit('datasetComparison/remove', details)
    },


    // get data for a dataset by its id
    // shamelessly copied without trying to DRY it up from datasets/_datasetId.vue ... TODO DRY it up

    async getDatasetDetails (datasetId, version, datasetType)  {
      const url = `${process.env.discover_api_host}/datasets/${datasetId}`
      const datasetUrl = version ? `${url}/versions/${version}` : url

      const simulationUrl = `${process.env.portal_api}/sim/dataset/${datasetId}`

      try {
        const datasetDetails =
          datasetType === 'simulation'
            ? await this.$axios.$get(simulationUrl)
            : await this.$axios.$get(datasetUrl)

        return datasetDetails
      } catch (error) {
        console.error(error)

        return {error: true, errorMessage: error}
      }
    },

    /**
     * Set active filters based on the query params
     * @params {Array} filters
     * @returns {Array}
     */
    setActiveFilters: function(filters) {
      const tags = (this.$route.query.tags || '').toLowerCase().split(',')

      return filters.map(category => {
        category.filters.map(filter => {
          const hasTag = tags.indexOf(filter.key.toLowerCase())
          filter.value = hasTag >= 0
          return filter
        })

        return category
      })
    },

    /**
     * Adjust the Title column width when
     * on smaller screens or mobile
     * @param {Number} width
     */
    onResize: function(width) {
      width <= 768
        ? (this.titleColumnWidth = 150)
        : (this.titleColumnWidth = 300)
      this.windowWidth = width
    },

    /**
     * Compute search column span
     */
    searchColSpan(viewport) {
      const viewports = {
        sm: 24,
        md: 24,
        lg: 24
      }

      return viewports[viewport] || 24
    },

    setDatasetFilter() {
      // doesn't do anything yet. But doesn't hurt so why not
      this.$router.replace({
        query: {
          type: 'dataset-vis-types',
          q: this.$route.query.q,
          datasetFilters: this.datasetFilters,
          skip: 0,
          limit: 10
        }
      })

      // take off active list
      const activeTypesFullInfo = discoveryDataTypes.filter(chartType => (
        this.datasetFilters.includes(chartType.label)
      ))

      this.activeDiscoveryDataTypes = activeTypesFullInfo.map(chartType => chartType.type)

    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.add-ds-form {
  display: flex;
  width: 100%;
  .input-wrap {
    display: flex;
    position: relative;
    width: 100%;
    border: .05rem solid black;
    border-radius: .2rem;
    margin: 0 .5rem;
  }
  input {
    background: #fff;
    border-radius: .2rem;
    box-sizing: border-box;
    border: none;
    color: #909399;
    flex: 1;
    font-size: 0.875rem;
    outline: none;
    margin: 0;
    padding: 0.5rem 2.25rem 0.5rem 0.8125rem;
    &:focus {
      border-color: $knowmore;
    }
    &::-ms-clear {
      display: none;
    }
  }
  .btn-clear-search {
    background: none;
    border: none;
    cursor: pointer;
    height: 100%;
    outline: none;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
    &:hover,
    &:active {
      opacity: 0.75;
    }
  }
  .btn-submit-search {
    background: $knowmore;
    color: white;
    border: 1px solid $knowmore;
    border-radius: 4px;
    cursor: pointer;
    height: 2.5rem;
    padding: 0 1.5rem;
    &[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media screen and (max-width: 28rem) {
      padding: 0 .5rem;
      span {
        display: none;
      }
    }
  }
  .clear-search {
    background-color: transparent;
    display: inline-block;
    border: none;
    width: fit-content;
    color: $cochlear;
    font-size: 1rem;
    font-family: $font-family;
  }
}

.page-hero {
  padding-bottom: 1.3125em;
}
.search-tabs__container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: white;
  border: 0.1rem solid $purple-gray;
  h3 {
    padding-left: 0.75rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
}
.search-bar__container {
  margin-top: 1em;
  padding: 0.75rem;
  border: 0.1rem solid $purple-gray;
  background: white;
  h5 {
    line-height: 1rem;
    font-weight: 600;
    font-size: 1rem;
  }
}
.search-tabs {
  display: flex;
  list-style: none;
  overflow: auto;
  margin: 0 0 0 0;
  padding: 0 0;
  outline: 0.1rem solid $median;
  li {
    width: 100%;
    text-align: center;
    color: $median;
  }
  li:last-child > a {
    border-right: none;
  }
}
.search-tabs__button {
  background: $light-purple;
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  outline: none;
  padding: 0;
  text-decoration: none;
  text-transform: uppercase;
  border-right: 0.1rem solid $median;
  line-height: 3.5rem;
  @media (min-width: 48em) {
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: none;
  }
  &[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:not([disabled]) {
    &:hover,
    &:focus,
    &.active {
      color: white;
      background-color: $median;
      font-weight: 500;
    }
  }
}
.page-wrap {
  padding-bottom: 1em;
  @media (min-width: 48em) {
    padding-bottom: 3em;
  }
}
.is-loading {
  background: #fff;
  padding: 16px;
  height: 1.5rem;
}
.table-wrap {
  background: #fff;
  border: 1px solid rgb(228, 231, 237);
  padding: 16px;
}
::v-deep .el-pagination {
  margin-top: 1.5em;
  text-align: right;
  background-color: transparent;
  @media screen and (max-width: 28em) {
    margin-top: 5px;
    padding-left: 0;
    .btn-prev {
      padding-left: 0;
    }
  }
  button {
    background-color: transparent;
  }
}
::v-deep {
  .el-table td {
    vertical-align: top;
  }
  .el-table .cell {
    word-break: normal;
  }
}
.btn__filters {
  align-items: center;
  background: none;
  border: none;
  color: $knowmore;
  display: flex;
  font-size: 0.875em;
  outline: none;
  padding: 0;
  &[disabled] {
    opacity: 0.7;
  }
  &:not([disabled]) {
    &:hover,
    &:focus {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .svg-icon {
    margin-right: 0.3125rem;
  }
}
.active__filter__wrap,
.active__filter__wrap-category {
  display: inline;
}
.active__filter__wrap .el-tag {
  margin: 0.5em 1em 0.5em 0;
}
.filter__wrap {
  padding-right: 1em;
}
.dataset-preview-img {
  max-height: 100px;
  max-width: 100px;
}

.dataset-filters {
  padding: 0.5rem 1rem 1rem;
  // hide for now
  //display: none;
  h2,
  h3 {
    font-size: 1.125rem;
    font-weight: normal;
    line-height: 1.2;
  }
  h2 {
    border-bottom: 1px solid #dbdfe6;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }
  h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
  }
  ::v-deep .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .el-checkbox__label {
    color: $knowmore;
  }
}
.btn-submit-knowmore {
  background: $knowmore;
  color: #fff;
  &:hover,
  &:active {
    opacity: 0.75;
  }
}
.previewText {
  cursor: pointer;
}
.dataset-row {
  justify-content: space-between;
  margin: 1rem;
}
.results-header {
  margin-top: 2rem;
}
.source-datasets-for-results {
  padding-left: 1rem;
}
</style>

