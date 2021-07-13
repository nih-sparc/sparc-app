<template>
  <div class="dataset-comparison-page">
    <breadcrumb :breadcrumb="breadcrumb" title="KnowMore Manual Discoveries!" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Compare Datasets
        </h3>
        <ul class="search-tabs">
          <li v-for="type in comparisonDataTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.type === 'image' }"
              :disabled="type.type !== 'image'"
              :to="{
                name: 'dataset-comparison',
                query: {
                  type: type.type,
                  q: $route.query.q
                }
              }"
            >
              {{ type.label }}
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div class="search-bar__container">
        <h5>
          Add datasets to compare
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
            <svg-icon
              icon="icon-magnifying-glass"
              height="25"
              width="25"
              dir="left"
            />
            <span>
              Add
            </span>
          </el-button>
        </div>
        <div v-loading="isLoadingDatasetPreview" class="table-wrap">
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
              v-if="comparisonDataType.type === 'image'"
              :sm="24"
              :md="6"
              :lg="4"
            >
              <div class="dataset-filters table-wrap">
                <h2>Fake Checkboxes:</h2>
                <h3>Options</h3>
                <div class="dataset-filters__filter-group">
                  <el-checkbox-group
                    v-model="datasetFilters"
                    @change="setDatasetFilter"
                  >
                    <el-checkbox label="Public" />
                    <el-checkbox label="Embargoed" />
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
                <h3>Datasets to Compare:</h3>
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
                    v-bind:src="dataset.imageUrl"
                  />
                </el-row>
              </div>
            </el-col>
            <el-button 
              class="btn-submit-search" 
              @click="compareDatasets"
              :disabled="datasetsToCompare.length == 0"
            >
              <span>
                Compare (Fake Button)
              </span>
            </el-button>
            <el-col
              :sm="searchColSpan('sm')"
              :md="searchColSpan('md')"
              :lg="searchColSpan('lg')"
            >
              <div v-loading="isLoadingComparison" class="table-wrap">
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
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


const comparisonDataTypes = [
  {
    label: 'Image',
    type: 'image',
    disabled: false,
  },
  {
    label: 'Metadata',
    // leave the type off, it feels more disabled
    //type: 'metadata',
    disabled: true,
  },
  {
    label: 'Full-Text',
    // leave the type off, it feels more disabled
    //type: 'full-text',
    disabled: true,
  }
]

const searchData = {
  limit: 10,
  skip: 0,
  items: [],
  order: undefined,
  ascending: false
}

const datasetFilters = ['Public']

import createClient from '@/plugins/contentful.js'
import { handleSortChange, transformFilters } from './utils'

const client = createClient()

export default {
  name: 'DataPage',

  components: {
    Breadcrumb,
    PageHero,
  },

  mixins: [],

  data: () => {
    return {
      searchQuery: '',
      filters: [],
      comparisonDataTypes,
      previewData: null,
      searchData: clone(searchData),
      isLoadingDatasetPreview: false,
      isLoadingComparison: false,
      toAddPreview: "",

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
      datasetFilters: [...datasetFilters]
    }
  },

  computed: {
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
     * Compute search type
     * @returns {String}
     */
    comparisonDataType: function() {
      // TODO add more options
      return {type: "image"}
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
  },
  /**
   * Check the comparisonDataType param in the route and set it if it doesn't exist
   * Shrink the title column width if on mobile
   */
  mounted: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(comparisonDataTypes)

      this.$router.replace({ query: { type: firstTabType } })
    } else {
      /**
       * Set the searchData from query params
       * Need to convert skip and limit from strings to numbers
       */
      const queryParams = {
        skip: Number(this.$route.query.skip || searchData.skip),
        limit: Number(this.$route.query.limit || searchData.limit),
        q: this.$route.query.q || ''
      }

      this.searchData = { ...this.searchData, ...queryParams }

      if (this.$route.query.datasetFilters) {
        this.datasetFilters = Array.isArray(this.$route.query.datasetFilters)
          ? this.$route.query.datasetFilters
          : [this.$route.query.datasetFilters]
      }
    }
    if (window.innerWidth <= 768) this.titleColumnWidth = 150
    window.onresize = () => this.onResize(window.innerWidth)
  },

  methods: {
    // add a dataset from the form to the compare list
    compareDatasets (e) {
      // TODO 
      console.log("this will compare the datasets")
    },

    addDataset (e) {
      if (!this.previewData || this.previewData.error) {
        console.log("not adding nothing")

        return
      }

      const datasetId = this.toAddPreview
      const details = this.previewData
      console.log("ds details: ", details)

      this.$store.commit('datasetComparison/add', details)
      e.target.value = ''
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
      console.log("ds details: ", details)

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

        const datasetOwnerId = datasetDetails.ownerId || ''
        const datasetOwnerEmail = await this.$axios
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
     * Determined if the comparisonDataType === 'dataset'
     */
    searchColSpan(viewport) {
      const isDataset = this.comparisonDataType.type === 'dataset'
      const viewports = {
        sm: isDataset ? 24 : 24,
        md: isDataset ? 18 : 24,
        lg: isDataset ? 20 : 24
      }

      return viewports[viewport] || 24
    },

    setDatasetFilter() {
      this.$router.replace({
        query: {
          type: 'dataset',
          q: this.$route.query.q,
          datasetFilters: this.datasetFilters,
          skip: 0,
          limit: 10
        }
      })

      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      this.searchData = clone(searchData)
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
      border-color: $median;
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
    background: $median;
    color: white;
    border: 1px solid $median;
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
  color: $median;
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
    color: $median;
  }
}
.previewText {
  cursor: pointer;
}
.dataset-row {
  justify-content: space-between;
  margin: 1rem;
}
</style>
