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
      ref="typesCategory"
      class="hide-bottom-border"
      collapse-by-default
      :category="typesCategory"
      :default-checked-ids="selectedResourceTypeIds"
      @selection-change="onTypeChanged"
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
import { pluck } from 'ramda'
import FacetMenu from './FacetMenu.vue'

const visibleCategories = ['type', 'developedBySparc']

const typesCategory = {
  label: 'Type',
  id: 'type',
  data: [
    {
      label: 'Devices',
      id: 'Devices',
    },
    {
      label: 'Data and Models',
      id: 'Data and Models',
    },
    {
      label: 'Information Services',
      id: 'Information Services',
    },
    {
      label: 'Software',
      id: 'Software',
    },
    {
      label: 'Biologicals',
      id: 'Biologicals',
    }
  ]
}

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
      typesCategory: typesCategory,
      developedBySparcCategory: developedBySparcCategory,
      selectedResourceTypeIds: [],
      selectedDevelopedBySparcIds: [],
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedFacets: function() {
      let facets = []
      if (this.selectedResourceTypeIds !== []) {
        this.selectedResourceTypeIds.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: typesCategory.id
          })
        })
      }
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
    if (this.$route.query.resourceTypes) {
      this.selectedResourceTypeIds = this.$route.query.resourceTypes.split(',')
    }
    this.selectedDevelopedBySparcIds = ['developedBySparc']
  },

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onTypeChanged: function(newValue) {
      this.selectedResourceTypeIds = newValue.checkedNodes

      this.$router.replace(
        {
          query: { ...this.$route.query, resourceTypes: this.selectedResourceTypeIds.length === 0 ? undefined : pluck('id', this.selectedResourceTypeIds).toString() }
        },
        () => {
          this.$emit('tool-and-resources-selections-changed')
        }
      )
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
            developedBySparc: undefined,
            resourceTypes: undefined
          }
        },
        () => {
          this.$emit('tool-and-resources-selections-changed')
          this.$refs.typesCategory.uncheckAll()
          this.$refs.developedBySparcCategory.uncheckAll()
        }
      )
    },
    deselectFacet(id) {
      this.$refs.typesCategory.uncheck(id)
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
