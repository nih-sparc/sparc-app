<template>
  <div class="white-background">
    <h2 class="title">
      Refine results
    </h2>
    <hr />
    <tags-container
      :selectedFacets="selectedFacets"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <hr />
    <facet-category
      v-for="item in this.facets"
      :key="item.id"
      :facet="item"
      :visible-facets="visibleFacets"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
// import FacetMenu from '@/components/FacetMenu/FacetMenu.vue'
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetCategory from '~/components/FacetMenu/FacetCategory'
export default {
  name: 'DatasetFacetMenu',

  components: { FacetCategory, TagsContainer },

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
      selectedFacets: []
    }
  },

  mounted() {},

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onSelectionChange: function() {

    },
    selectedFacetsChanged: function(newSelectedFacets) {
			this.selectedFacets = newSelectedFacets
      this.$emit('selected-facets-changed', newSelectedFacets)
  	},
		deselectAllFacets() {
      this.$refs.menu.deselectAllFacets()
    },
    deselectFacet(id) {
      this.$refs.menu.deselectFacet(id)
    }
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
	.white-background {
		background-color: white;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.2;
	}

	.title {
		margin-bottom: 0;
		padding: 0.5rem 1rem;
	}

	hr {
		border: none;
		border-bottom: 1px solid #dbdfe6;
		margin: 0;
	}
  
</style>

