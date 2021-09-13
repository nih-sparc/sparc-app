<template>
  <facet-menu
		:selectedFacets="selectedFacetArray"
		@deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-category
			:defaultCheckedKeys="defaultCheckedKeys"
      :facet="typesCategory"
			@selection-change="onTypeChanged"
			ref="typesCategory"
    />
		<facet-category
			:defaultCheckedKeys="defaultCheckedKeys"
      :facet="createdBySparcCategory"
			:hideShowAllOption="true"
			:showCollapsibleLabelArrow="false"
			@selection-change="onCreatedBySparcChanged"
			ref="createdBySparcCategory"
    />
  </facet-menu>
</template>

<script>
import { pluck } from 'ramda'
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetCategory from '@/components/FacetMenu/FacetCategory.vue'
import FacetMenu from './FacetMenu.vue'

const typesCategory = {
	label: 'Type',
	key: 'type',
	children: [
		{
			label: 'Devices',
			id: 'Device',
			children:[],
			key: 'Device'
		},
		{
			label: 'Data and Models',
			id: 'Databases',
			children:[],
			key: 'Databases'
		},
		{
			label: 'Information Services',
			id: 'Information Services',
			children:[],
			key: 'Information Services'
		},
		{
			label: 'Software',
			id: 'Software',
			children:[],
			key: 'Software'
		},
		{
			label: 'Biologicals',
			id: 'Biologicals',
			children:[],
			key: 'Biologicals'
		}
	]
}

const createdBySparcCategory = {
	label: 'created by sparc',
	key: 'developedBySparc',
	children: [
		{
			label: 'Show only if "YES"',
			id: 'developedBySparc',
			children:[],
			key: 'developedBySparc'
		}
	]
}

export default {
  name: 'ToolsAndResourcesFacetMenu',

  components: { FacetCategory, TagsContainer, FacetMenu },

  props: {
  },

  data() {
    return {
      showFacetMenu: (process.env.show_facet_menu == 'true') ? true : false,
      selectedFacets: {},
      selectedFacetArray: [],
			typesCategory: typesCategory,
			createdBySparcCategory : createdBySparcCategory,
			defaultCheckedKeys: []
    }
  },

	mounted() {
    if (this.$route.query.resourceTypes) {
      this.defaultCheckedKeys = this.$route.query.resourceTypes.split(",")
    }
		if (this.$route.query.developedBySparc) {
			this.defaultCheckedKeys = this.defaultCheckedKeys.concat([this.createdBySparcCategory.children[0].id])
		}
	},

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    deselectAllFacets() {
      this.$refs.facetCategories.map(facetCategory => facetCategory.uncheckAll())
    },
    deselectFacet(id) {
      this.$refs.facetCategories.map(facetCategory => facetCategory.uncheck(id))
    },
		onTypeChanged: function(data) {
			this.setSelectedFacetArray(data)

			var selectedResourceTypes = pluck('id', data.facets).toString()
			selectedResourceTypes = selectedResourceTypes === '' ? undefined : selectedResourceTypes;

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
			this.setSelectedFacetArray(data)

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
          query: { ...this.$route.query, developedBySparc: undefined, resourceTypes: undefined }
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
		setSelectedFacetArray(data) {
			this.selectedFacets[data.key] = data.facets
      this.selectedFacetArray = []
			for (const [key, value] of Object.entries(this.selectedFacets)) {
      	this.selectedFacetArray = this.selectedFacetArray.concat(value)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../assets/_variables.scss';
</style>

