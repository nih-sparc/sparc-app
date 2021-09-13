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
  </facet-menu>
</template>

<script>
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetCategory from '@/components/FacetMenu/FacetCategory.vue'
import FacetMenu from './FacetMenu.vue'
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
    defaultCheckedFacetIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showFacetMenu: (process.env.show_facet_menu == 'true') ? true : false,
      selectedFacets: {},
      selectedFacetArray: []
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
      this.$emit('selected-facets-changed', data.key, Object.keys(data.facets).length ,this.selectedFacetArray)

    },
    deselectAllFacets() {
      this.$refs.facetCategories.map(facetCategory => facetCategory.uncheckAll())
    },
    deselectFacet(id) {
      this.$refs.facetCategories.map(facetCategory => facetCategory.uncheck(id))
    }
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
  
</style>

