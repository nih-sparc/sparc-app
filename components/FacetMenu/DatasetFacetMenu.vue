<template>
  <div class="white-background">
    <h2 class="title">
      Refine results
    </h2>
    <hr />
    <tags-container
      :selectedFacets="selectedFacetArray"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <facet-category
      v-for="item in this.facets"
      :key="item.id"
      :facet="item"
      :visible-facets="visibleFacets"
      :default-checked-keys="defaultCheckedFacetIds"
      @selection-change="onSelectionChange"
      ref="facetCategories"
    />
  </div>
</template>

<script>
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
      selectedFacets: {},
      selectedFacetArray: []
    }
  },
  // watch: {
  //   selectedFacets: function() {
  //     let result = []
  //     for (let n in Object.keys(this.selectedFacets)) {
  //       result.push(this.selectedFacets[n])
  //     }
  //     return result
  //   }
  // },

  mounted() {},

  methods: {
    visibleFacetsForCategory: function(key) {
      return this.visibleFacets[key]
    },
    onSelectionChange: function(data) {
      console.log(data)
      this.selectedFacets[data.key] = data.facets

      this.selectedFacetArray = []
      for (const [key, value] of Object.entries(this.selectedFacets)) {
        this.selectedFacetArray = this.selectedFacetArray.concat(value)
      }

      this.$emit('selected-facets-changed', data.key, Object.keys(data.facets).length ,this.selectedFacetArray)

    },
    // selectedFacetsChanged: function(newSelectedFacets) {
		// 	this.selectedFacets = newSelectedFacets
    //   this.$emit('selected-facets-changed', newSelectedFacets)
  	// },
    deselectAllFacets() {
      this.$refs.facetCategories.map(FacetCategory => FacetCategory.uncheckAll())
    },
    deselectFacet(id) {
      this.$refs.facetCategories.map(FacetCategory => FacetCategory.uncheck(id))
    }
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
	.white-background {
		background-color: white;
    border: 0.1rem solid #e4e7ed
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

