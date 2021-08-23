<template>
  <div class="white-background">
    <h2 class="title">
      Refine results
    </h2>
    <hr />
		<tags-container :selectedFacets="selectedFacets" @deselect-facet="deselectFacet" @deselect-all-facets="deselectAllFacets"/>
    <hr />
		<hr />
		<div class="types-section">
			<div class="types-title">
      	Type
    	</div>
			<el-radio-group v-model="selectedType">
				<el-radio :label="0">Projects</el-radio>
				<el-radio :label="1">About</el-radio>
				<el-radio :label="2">Help</el-radio>
			</el-radio-group>
		</div>
		<hr />
    <facet-menu ref="menu" :facets="facets" :defaultCheckedFacetIds="defaultCheckedFacetIds" :visibleFacets="visibleFacets" @selected-facets-changed="selectedFacetsChanged"/>
  </div>
</template>

<script>
import FacetMenu from '@/components/FacetMenu/FacetMenu.vue'
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
export default {
  name: 'SparcInfoFacetMenu',

  components: { FacetMenu, TagsContainer },

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
      selectedFacets: [],
			selectedType: 0
    }
  },

  methods: {
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

<style lang="scss">
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

.types-section {
	margin: 0.75rem;
	font-weight: 500;

	.el-radio {
		display: block;
		margin: .75rem .75rem .75rem 1rem;

		.el-radio__label {
			color: black;
			font-size: 1rem;
			line-height: 0;
		}
	}

	.types-title {
		text-transform: uppercase;
	}
}
</style>