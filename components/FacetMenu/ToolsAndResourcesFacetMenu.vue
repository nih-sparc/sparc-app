<template>
  <facet-menu
    :selected-facets="selectedFacetsArray"
    :visible-facet-categories="visibleCategories"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-category
      ref="typesCategory"
      :default-checked-keys="defaultCheckedKeys"
      :facet="typesCategory"
      @selection-change="onTypeChanged"
    />
    <facet-category
      ref="createdBySparcCategory"
      :default-checked-keys="defaultCheckedKeys"
      :facet="createdBySparcCategory"
      :collapse-by-default="false"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onCreatedBySparcChanged"
    />
  </facet-menu>
</template>

<script>
import { pluck, isEmpty } from 'ramda'
import FacetCategory from '@/components/FacetMenu/FacetCategory.vue'
import FacetMenu from './FacetMenu.vue'

const visibleCategories = ['type', 'developedBySparc']

const typesCategory = {
  label: 'Type',
  key: 'type',
  children: [
    {
      label: 'Devices',
      id: 'Devices',
      children: [],
      facetPropPath: 'type',
      key: 'Devices'
    },
    {
      label: 'Data and Models',
      id: 'Data and Models',
      children: [],
      facetPropPath: 'type',
      key: 'Data and Models'
    },
    {
      label: 'Information Services',
      id: 'Information Services',
      children: [],
      facetPropPath: 'type',
      key: 'Information Services'
    },
    {
      label: 'Software',
      id: 'Software',
      children: [],
      facetPropPath: 'type',
      key: 'Software'
    },
    {
      label: 'Biologicals',
      id: 'Biologicals',
      children: [],
      facetPropPath: 'type',
      key: 'Biologicals'
    }
  ]
}

const createdBySparcCategory = {
  label: 'created by sparc',
  key: 'developedBySparc',
  id: 'developedBySparc',
  facetPropPath: 'developedBySparc',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'developedBySparc',
      children: [],
      facetPropPath: 'developedBySparc',
      key: 'developedBySparc'
    }
  ]
}

export default {
  name: 'ToolsAndResourcesFacetMenu',

  components: { FacetCategory, FacetMenu },

  props: {},

  data() {
    return {
      selectedFacets: {},
      selectedFacetsArray: [],
      typesCategory: typesCategory,
      createdBySparcCategory: createdBySparcCategory,
      defaultCheckedKeys: [],
      visibleCategories: visibleCategories
    }
  },

  mounted() {
    if (this.$route.query.resourceTypes) {
      this.defaultCheckedKeys = this.$route.query.resourceTypes.split(',')
    }
    if (this.$route.query.developedBySparc) {
      this.defaultCheckedKeys = this.defaultCheckedKeys.concat([
        this.createdBySparcCategory.children[0].id
      ])
    }
  },

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onTypeChanged: function(data) {
      this.setSelectedFacetsArray(data)

      var selectedResourceTypes = pluck('id', data.facets).toString()
      selectedResourceTypes =
        selectedResourceTypes === '' ? undefined : selectedResourceTypes

      this.$router.replace(
        {
          query: { ...this.$route.query, resourceTypes: selectedResourceTypes }
        },
        () => {
          this.$emit('tool-and-resources-selections-changed')
        }
      )
    },
    onCreatedBySparcChanged: function(data) {
      if (!isEmpty(data.facets)) {
        this.setSelectedFacetsArray({
          facets: [createdBySparcCategory],
          key: 'developedBySparc'
        })
      } else {
        this.setSelectedFacetsArray(data)
      }

      const developedBySparc = data.facets.length > 0 ? true : undefined
      this.$router.replace(
        {
          query: { ...this.$route.query, developedBySparc: developedBySparc }
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
    setSelectedFacetsArray(data) {
      this.selectedFacets[data.key] = data.facets
      this.selectedFacetsArray = []
      for (const [key, value] of Object.entries(this.selectedFacets)) {
        this.selectedFacetsArray = this.selectedFacetsArray.concat(value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/_variables.scss';
</style>
