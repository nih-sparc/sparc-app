<template>
	<div class="tags-container">
		<span class="flex">
			Filters applied:
			<el-link @click="deselectAllFacets">Reset all</el-link>
		</span>
		<hr />
		<el-card shadow="never" class="facet-card">
			<span v-if="selectedFacets.length == 0" class="no-facets">No filters applied</span>
			<el-tag
				v-for="facet in selectedFacets"
				:key="facet.id"
        class="capitalize"
				disable-transitions
				closable
				@close="deselectFacet(facet.id)"
			>
				{{ facet.label }}
			</el-tag>
		</el-card>
	</div>
</template>

<script>
export default {
  name: 'TagsContainer',

  props: {
    // All facets contained in the menu
    selectedFacets: {
      type: Array,
      default: () => []
    },
  },
  
  methods: {
		deselectAllFacets() {
      this.$emit('deselect-all-facets')
    },
    deselectFacet(id) {
			this.$emit('deselect-facet', id)
    }
	}
}
</script>

<style lang="scss">
@import '../../assets/_variables.scss';
  .tags-container {
    margin: 0.75rem;
    hr {
      padding-bottom: 0.75rem;
      margin-bottom: 0.5rem;
			border: none;
			border-bottom: 1px solid #dbdfe6;
    }
    .flex {
      display: flex;
      .el-link {
        margin-left: auto;
      }
    }
    .facet-card {
      .el-card__body {
        padding: 10px;
        height: 6rem;
        overflow-y: auto;
      }
      .no-facets {
        font-style: italic;
        opacity: 0.5;
      }
      .capitalize {
        text-transform: capitalize;
      }
    }
		.el-link .el-link--inner {
			text-decoration: underline;
			text-transform: none;
			color: $median;
			a:hover {
				text-decoration: none;
			}
		}
		//el-link adds a component with a border in order to underline the text.
		//The underline is too low so we cannot use it, and must instead hide it
		.el-link.el-link--default:after {
			border: none;
		}
  }
  
</style>

