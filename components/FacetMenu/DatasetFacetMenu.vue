<template>
  <facet-menu
    v-if="showFacetMenu"
    :selectedFacets="selectedFacetArray"
    :visibleFacetCategories="visibleCategories"
    :visibleFacets="facetMenuVisibleFacets"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-category
      v-for="item in this.facets"
      v-show="visibleCategories.includes(item.key)"
      :key="item.id"
      :facet="item"
      :visible-facets="visibleFacets"
      :default-checked-keys="defaultCheckedFacetIds"
      @selection-change="onSelectionChange"
      ref="facetCategories"
    />
    <facet-category
      v-show="visibleCategories.includes(embargoedFacetCategory.key)"
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
import { pluck, pathOr } from 'ramda'
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetCategory from '@/components/FacetMenu/FacetCategory.vue'
import FacetMenu from './FacetMenu.vue'
import { facetPropPathMapping } from '~/pages/data/utils'

const embargoedFacetCategory = {
  label: 'Availability',
  id: 'availabilty',
  key: 'availability',
  children: [
    {
      label: 'Include Embargoed',
      id: 'embargoed',
      children: [],
      facetPropPath: 'availability',
      key: 'embargoed'
    }
  ]
}

const visibleDatasetsFacetCategories = [
  'anatomy.organ.name',
  'organisms.primary.species.name',
  'item.modalities.keyword',
  'attributes.subject.sex.value',
  'attributes.subject.ageCategory.value',
  'availability'
];

const visibleModelsAndSimulationsFacetCategories = ['item.types.name', 'anatomy.organ.name', 'organisms.primary.species.name', 'availability'];

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

  computed: {
    visibleCategories: function() {
      return this.$route.query.type === 'dataset' ? visibleDatasetsFacetCategories : visibleModelsAndSimulationsFacetCategories
    },
    facetMenuVisibleFacets: function() {
      const availability = {
        'Include Embargoed': true,
        facetPropPath: 'availability',
      }
      return {...this.visibleFacets, availability}
    }
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
      var filters = 'NOT item.published.status:embargo'
      if(this.selectedFacetArray.some(facet => facet.key === this.embargoedFacetCategory.children[0].key) && this.visibleCategories.includes(embargoedFacetCategory.key)) {
        filters += ' OR item.published.status:embargo'
      }
      filters = `(${filters}) AND `
      const facetPropPaths = Object.keys(facetPropPathMapping)
      facetPropPaths.map(facetPropPath => {
        if (!this.visibleCategories.includes(facetPropPath)) {
          return
        }
        const facetsToOr = this.selectedFacetArray.filter(
          facet => facet.facetPropPath == facetPropPath
        )
        var filter = ''
        facetsToOr.map(facet => {
          if (pathOr(undefined, [facet.facetPropPath, facet.label], this.visibleFacets) === undefined) {
            return
          }
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
          this.$refs.facetCategories.map(facetCategory => {
            if (this.visibleCategories.includes(facetCategory.facet.key))
              facetCategory.uncheckAll()
          })
          this.$refs.embargoedFacetCategory.uncheckAll()
          this.$emit('selected-facets-changed')
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

