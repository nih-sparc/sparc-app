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
      :category="typesCategory"
      :default-checked-ids="selectedResourceTypeIds"
      @selection-change="onTypeChanged"
    />
    <dropdown-multiselect
      ref="createdBySparcCategory"
      :category="createdBySparcCategory"
      :check-all-by-default="false"
      @selection-change="onCreatedBySparcChanged"
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

const createdBySparcCategory = {
  label: 'created by sparc',
  id: 'developedBySparc',
  data: [
    {
      label: 'Show only if "YES"',
      id: 'true',
    }
  ]
}

export default {
  name: 'ToolsAndResourcesFacetMenu',

  components: { FacetMenu },

  data() {
    return {
      typesCategory: typesCategory,
      createdBySparcCategory: createdBySparcCategory,
      selectedResourceTypeIds: [],
      selectedCreatedBySparcIds: [],
      visibleCategories: visibleCategories
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
      if (this.selectedCreatedBySparcIds !== []) {
        this.selectedCreatedBySparcIds.forEach(selectedOption => {
          facets.push({
            label: `${createdBySparcCategory.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: createdBySparcCategory.id
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
    if (this.$route.query.developedBySparc) {
      this.selectedCreatedBySparcIds = createdBySparcCategory.data
    }
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
    onCreatedBySparcChanged: function(newValue) {
      this.selectedCreatedBySparcIds = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, developedBySparc: this.selectedCreatedBySparcIds.length === 0 ? undefined : pluck('id', this.selectedCreatedBySparcIds).toString() }
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
          this.$refs.createdBySparcCategory.uncheckAll()
        }
      )
    },
    deselectFacet(id) {
      this.$refs.typesCategory.uncheck(id)
      this.$refs.createdBySparcCategory.uncheck(id)
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
