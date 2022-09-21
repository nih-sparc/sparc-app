<template>
  <div>
    <facet-menu
      class="hide-bottom-border"
      :selected-facets="selectedFacets"
      :visible-facet-categories="visibleCategories"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <dropdown-multiselect
      :category="developedBySparcCategory"
      :default-checked-ids="selectedDevelopedBySparcIds"
      @selection-change="onDevelopedBySparcChanged"
      ref="developedBySparcCategory"
    />
  </div>
</template>

<script>
import FacetMenu from './FacetMenu.vue'

const visibleCategories = ['developedBySparc']

const developedBySparcCategory = {
  label: 'Developed By SPARC',
  id: 'developedBySparc',
  data: [
    {
      label: 'Developed By SPARC',
      id: 'developedBySparc',
      facetPropPath: 'developedBySparc'
    }
  ]
}

export default {
  name: 'ToolsAndResourcesFacetMenu',

  components: { FacetMenu },

  data() {
    return {
      developedBySparcCategory: developedBySparcCategory,
      selectedDevelopedBySparcIds: [],
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedFacets: function() {
      let facets = []
      if (this.selectedDevelopedBySparcIds !== []) {
        this.selectedDevelopedBySparcIds.forEach(selectedOption => {
          facets.push({
            label: `${developedBySparcCategory.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: developedBySparcCategory.id
          })
        })
      }
      return facets
    }
  },

  mounted() {
    if (this.$route.query.developedBySparc) {
      this.selectedDevelopedBySparcIds = ['developedBySparc']
    }
  },

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onDevelopedBySparcChanged: function(newValue) {
      this.selectedDevelopedBySparcIds = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, developedBySparc: this.selectedDevelopedBySparcIds.length === 0 ? undefined : true }
        },
        () => {
          this.$emit('tool-and-resources-selections-changed')
        }
      )
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            developedBySparc: undefined
          }
        },
        () => {
          this.$emit('tool-and-resources-selections-changed')
          this.$refs.developedBySparcCategory.uncheckAll()
        }
      )
    },
    deselectFacet(id) {
      this.$refs.developedBySparcCategory.uncheck(id)
    },
  }
}
</script>
<style lang="scss" scoped>
.hide-bottom-border {
  // hacky fix to address placing the design system drop down for the category outside the facet menu since it handles its own borders
  border-bottom: none;
}
</style>
