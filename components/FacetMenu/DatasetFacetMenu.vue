<template>
  <div class="dataset-facet-menu">
    <facet-menu
      :selectedFacets="selectedFacetArray"
      :visibleFacetCategories="visibleCategories"
      :visibleFacets="facetMenuVisibleFacets"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <hr class="expand-all-separator"/>
    <span class="flex expand-all-container">
      <el-link @click="expandAllCategories">
        Expand all
      </el-link>
    </span>
    <dropdown-multiselect
      v-for="item in this.facets"
      v-show="visibleCategories.includes(item.key)"
      collapse-by-default
      :key="item.id"
      :category="constructCategory(item)"
      :visible-data="visibleFacets"
      :default-checked-ids="defaultCheckedFacetIds"
      @selection-change="onSelectionChange"
      ref="facetCategories"
    />
    <dropdown-multiselect
      v-show="visibleCategories.includes(embargoedFacetCategory.id)"
      collapse-by-default
      :category="embargoedFacetCategory"
      :default-checked-ids="defaultCheckedFacetIds"
      :tooltip="embargoFacetCategoryTooltip"
      @selection-change="onSelectionChange"
      ref="embargoedFacetCategory"
    />
  </div>
</template>

<script>
import { pluck, pathOr } from 'ramda'
import FacetMenu from './FacetMenu.vue'
import { facetPropPathMapping } from '~/pages/data/utils'

const embargoedFacetCategory = {
  label: 'Availability',
  id: 'availability',
  data: [
    {
      label: 'Embargoed',
      id: 'embargoed',
      facetPropPath: 'availability',
    },
    {
      label: 'Not Embargoed',
      id: 'not embargoed',
      facetPropPath: 'availability',
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

const visibleModelsAndSimulationsFacetCategories = ['anatomy.organ.name', 'availability'];

const embargoFacetCategoryTooltip = "SPARC datasets are subject to a 1 year embargo during which time<br/>the datasets are visible only to members of the SPARC consortium.<br/>During embargo, the public will be able to view basic metadata about<br/>these datasets as well as their release date."

export default {
  name: 'DatasetFacetMenu',

  components: { FacetMenu },

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
      if (this.$route.query.type === 'simulation' || this.$route.query.type === 'model') {
        return visibleModelsAndSimulationsFacetCategories
      }
      return visibleDatasetsFacetCategories
    },
    facetMenuVisibleFacets: function() {
      const availability = {
        'Embargoed': true,
        'Not Embargoed': true,
        facetPropPath: 'availability',
      }
      return {...this.visibleFacets, availability}
    },
    embargoedFilter: function() {
      if(this.visibleCategories.includes(embargoedFacetCategory.id)) {
        if (this.selectedFacetArray.some(facet => facet.id === this.embargoedFacetCategory.data[0].id))
        {
          return 'item.published.status:embargo'
        } else if(this.selectedFacetArray.some(facet => facet.id === this.embargoedFacetCategory.data[1].id)) {
          return 'NOT item.published.status:embargo'
        } else {
          return 'NOT item.published.status:embargo OR item.published.status:embargo'
        }  
      }
      return ''
    }
  },

  data() {
    return {
      selectedFacets: {},
      selectedFacetArray: [],
      defaultCheckedFacetIds: [],
      embargoedFacetCategory : embargoedFacetCategory,
      embargoFacetCategoryTooltip: embargoFacetCategoryTooltip,
      numKeys: 0,
      latestUpdateId: '',
    }
  },

  mounted() {
    if (this.$route.query.selectedFacetIds) {
      this.defaultCheckedFacetIds = this.$route.query.selectedFacetIds.split(",")
    }
  },

  methods: {
    constructCategory: function(item) {
      if (item === null || item === undefined) {
        return
      }
      const category = {
        label: item.label,
        id: Object.keys(facetPropPathMapping).find(key => facetPropPathMapping[key] === item.label),
        data: item.children
      }
      return category
    },
    visibleFacetsForCategory: function(id) {
      return this.visibleFacets[id]
    },
    onSelectionChange: function(data) {
      this.selectedFacets[data.id] = data.checkedNodes

      this.selectedFacetArray = []
      for (const [id, value] of Object.entries(this.selectedFacets)) {
        this.selectedFacetArray = this.selectedFacetArray.concat(value)
      }
      const selectedFacetIds = this.selectedFacetArray.length === 0 ? undefined : pluck('id', this.selectedFacetArray).toString()
      this.$router.replace({
        query: {
          ...this.$route.query,
          selectedFacetIds: selectedFacetIds
        }
      }).then(() => {
        this.latestUpdateId = data.id;
        this.numKeys = data.checkedNodes.length
        this.$emit('selected-facets-changed')
      }).catch(() => {})
    },
    /* Returns filter for searching algolia. All facets of the same category are joined with OR,
     * and each of those results is then joined with an AND.
     * i.e. (color:blue OR color:red) AND (shape:circle OR shape:red) */
    getFilters() {
      if (this.selectedFacetArray === undefined) {
        return undefined
      }
      let filters = this.embargoedFilter
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
      return this.latestUpdateId
    },
    hasKeys() {
      return this.numKeys > 0
    },
    deselectAllFacets() {
      this.$refs.facetCategories.map(facetCategory => {
        if (this.visibleCategories.includes(facetCategory.category.id))
          facetCategory.uncheckAll()
      })
      this.$refs.embargoedFacetCategory.uncheckAll()
    },
    deselectFacet(id) {
      this.$refs.facetCategories.map(facetCategory => facetCategory.uncheck(id))
      this.$refs.embargoedFacetCategory.uncheck(id)
    },
    expandAllCategories() {
      this.$refs.facetCategories.map(facetCategory => {
        if (this.visibleCategories.includes(facetCategory.category.id))
          facetCategory.setCollapsed(false)
      })
      this.$refs.embargoedFacetCategory.setCollapsed(false)
    },
	}
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.dataset-facet-menu > .sparc-design-system-component-dropdown-multiselect:not(:last-child) {
  border-bottom: none;
}

hr {
  margin: 0;
  border: none;
  border-bottom: 1px solid $lineColor2;
}

::v-deep .el-link .el-link--inner {
  text-decoration: underline;
  text-transform: none;
  color: $purple;
  a:hover {
    text-decoration: none;
  }
}
//el-link adds a component with a border in order to underline the text.
//The underline is too low so we cannot use it, and must instead hide it
.el-link.el-link--default:after {
  border: none;
}

.flex {
  display: flex;
  border-left: 1px solid $lineColor2;
  border-right: 1px solid $lineColor2;
  .el-link {
    margin: .5rem .75rem .5rem auto;
  }
}

.expand-all-container {
  background-color: white;
}

</style>

