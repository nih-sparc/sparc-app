<template>
  <facet-menu
    v-if="showFacetMenu"
    :selectedFacets="selectedFacetArray"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-category
      v-for="item in this.facets"
      :key="item.id"
      :facet="item"
      :visible-facets="visibleFacets"
      :default-checked-keys="defaultCheckedFacetIds"
      @selection-change="onSelectionChange"
      ref="facetCategories"
    />
    <facet-category
      :facet="embargoedFacetCategory"
      :default-checked-keys="defaultCheckedFacetIds"
      @selection-change="onSelectionChange"
      :show-collapsible-label-arrow="false"
      hide-show-all-option
      show-help-icon
      :tooltip="embargoFacetCategoryTooltip"
      ref="embargoedFacetCategory"
    />
  </facet-menu>
</template>

<script>
import { pluck } from 'ramda'
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetCategory from '@/components/FacetMenu/FacetCategory.vue'
import FacetMenu from './FacetMenu.vue'
import { facetPropPathMapping } from '~/pages/data/utils'

const embargoedFacetCategory = {
  label: 'Availability',
  key: 'availability',
  children: [
    {
      label: 'Include Embargoed',
      id: 'embargoed',
      children: [],
      key: 'embargoed'
    }
  ]
}

const embargoFacetCategoryTooltip = "SPARC data sets are subject to a 1 year embargo during which time<br/>the data sets are visible only to members of the SPARC consortium.<br/>During embargo, the public will be able to view basic metadata about<br/>these data sets as well as their release date."

export default {
  name: 'DatasetFacetMenu',

  components: { FacetCategory, TagsContainer, FacetMenu },

  props: {
    facets: {
      type: Array,
      default: () => []
    },
    visibleFacets: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      showFacetMenu: (process.env.show_facet_menu == 'true') ? true : false,
      selectedFacets: {},
      selectedFacetArray: [],
      defaultCheckedFacetIds: [],
      embargoedFacetCategory : embargoedFacetCategory,
      embargoFacetCategoryTooltip: embargoFacetCategoryTooltip,
      numKeys: 0,
      latestUpdateKey: '',
    }
  },

  mounted() {
    if (this.$route.query.selectedFacetIds) {
      this.defaultCheckedFacetIds = this.$route.query.selectedFacetIds.split(",")
    }
  },

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onSelectionChange: function(data) {
      this.selectedFacets[data.key] = data.facets

      this.selectedFacetArray = []
      for (const [key, value] of Object.entries(this.selectedFacets)) {
        this.selectedFacetArray = this.selectedFacetArray.concat(value)
      }
      
      this.$router.replace({
        query: {
          ...this.$route.query,
          selectedFacetIds: this.selectedFacetArray.length === 0 ? undefined : pluck('id', this.selectedFacetArray).toString()
        }
      }).catch(()=> {}).finally(() => {
        this.latestUpdateKey = data.key;
        this.numKeys = Object.keys(data.facets).length

        this.$emit('selected-facets-changed')
      })
    },
    /* Returns filter for searching algolia. All facets of the same category are joined with OR,
     * and each of those results is then joined with an AND.
     * i.e. (color:blue OR color:red) AND (shape:circle OR shape:red) */
    getFilters() {
      if (this.selectedFacetArray === undefined) {
        return undefined
      }
      var filters = 'pennsieve.embargo.keyword:false'
      if(this.selectedFacetArray.some(facet => facet.key === this.embargoedFacetCategory.children[0].key)) {
        filters += ' OR pennsieve.embargo.keyword:true'
      }
      filters = `(${filters}) AND `
      const facetPropPaths = Object.keys(facetPropPathMapping)
      facetPropPaths.map(facetPropPath => {
        const facetsToOr = this.selectedFacetArray.filter(
          facet => facet.facetPropPath == facetPropPath
        )
        var filter = ''
        facetsToOr.map(facet => {
          filter += `"${facetPropPath}":"${facet.label}" OR `
        })
        if (filter == '') {
          return
        }
        filter = `(${filter.substring(0, filter.lastIndexOf(' OR '))})`
        filters += `${filter} AND `
      })
      return filters.substring(0, filters.lastIndexOf(' AND '))
    },
    getLatestUpdateKey() {
      return this.latestUpdateKey
    },
    hasKeys() {
      return this.numKeys > 0
    },
    deselectAllFacets() {
      this.selectedFacets = []

      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            selectedFacetIds : undefined
          }
        },
        () => { 
          this.$refs.facetCategories.map(facetCategory => facetCategory.uncheckAll())
          this.$refs.embargoedFacetCategory.uncheckAll()
          this.$emit('selected-facets-changed', undefined, 0 , [])
        }
      )
    },
    deselectFacet(id) {
      this.$refs.facetCategories.map(facetCategory => facetCategory.uncheck(id))
      this.$refs.embargoedFacetCategory.uncheck(id)
    }
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
  
</style>

