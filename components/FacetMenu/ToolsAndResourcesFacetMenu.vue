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
      :category="typeCategory"
      :default-checked-ids="selectedTypeIds"
      @selection-change="onTypesChanged"
      ref="typeCategory"
    />
  </div>
</template>

<script>
import FacetMenu from './FacetMenu.vue'
import { pluck } from 'ramda'

const visibleCategories = ['type']

const TYPE_CATEGORY = {
  label: 'Type',
  id: 'type',
  data: [
    {
      label: 'Developed By SPARC',
      id: 'developedBySparc'
    },
    {
      label: 'Codeathon',
      id: 'codeathon'
    }
  ]
}

export default {
  name: 'ToolsAndResourcesFacetMenu',

  components: { FacetMenu },

  data() {
    return {
      typeCategory: TYPE_CATEGORY,
      selectedTypeIds: [],
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedFacets: function() {
      let facets = []
      if (this.selectedTypeIds !== []) {
        this.selectedTypeIds.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: this.typeCategory.id
          })
        })
      }
      return facets
    }
  },

  mounted() {
    if (this.$route.query.type) {
      this.selectedTypeIds = this.$route.query.type.split(',')
    }
  },

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onTypesChanged: function(newValue) {
      this.selectedTypeIds = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, type: this.selectedTypeIds.length === 0 ? undefined : pluck('id', this.selectedTypeIds).toString() }
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
            developedBySparc: undefined,
            codeathon: undefined
          }
        },
        () => {
          this.$emit('tool-and-resources-selections-changed')
          this.$refs.typeCategory.uncheckAll()
        }
      )
    },
    deselectFacet(id) {
      this.$refs.typeCategory.uncheck(id)
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
