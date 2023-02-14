<template>
  <div class="dataset-facet-menu">
    <facet-menu
      :selectedFacets="selectedFacets"
      :visible-facet-categories="visibleCategories"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <hr class="expand-all-separator"/>
    <span class="flex expand-all-container">
      <el-link @click="expandAllCategories">
        Expand all
      </el-link>
    </span>
    <dropdown-multiselect
      ref="anatomicalFocusCategory"
      collapse-by-default
      :category="anatomicalFocusCategory"
      :default-checked-ids="defaultCheckedAnatomicalFocusIds"
      @selection-change="onAnatomicalFacetSelectionChange"
    />
    <dropdown-multiselect
      v-if="showFundingFacet"
      ref="fundingCategory"
      collapse-by-default
      :category="fundingCategory"
      :default-checked-ids="defaultCheckedFundingIds"
      @selection-change="onFundingFacetSelectionChange"
    />
  </div>
</template>

<script>
import { pluck } from 'ramda'
import FacetMenu from './FacetMenu.vue'

const ANATOMICAL_FOCUS_CATEGORY_ID = 'anatomicalFocus'
const FUNDING_CATEGORY_ID = 'funding'

export default {
  name: 'ProjectsFacetMenu',

  components: { FacetMenu },

  props: {
    anatomicalFocusFacets: {
      type: Array,
      default: () => []
    },
    fundingFacets: {
      type: Array,
      default: () => []
    }
  },  
  
  data() {
    return {
      showFundingFacet: process.env.SHOW_FUNDING_FACET == 'true',
      selectedAnatomicalFocusFacets: [],
      selectedFundingFacets: [],
      defaultCheckedAnatomicalFocusIds: [],
      defaultCheckedFundingIds: []
    }
  },

  computed: {
    anatomicalFocusCategory: function() {
      return {
        label: 'Anatomical Focus',
        id: ANATOMICAL_FOCUS_CATEGORY_ID,
        data: this.anatomicalFocusFacets
      }
    },
    fundingCategory: function() {
      return {
        label: 'Funding Program',
        id: FUNDING_CATEGORY_ID,
        data: this.fundingFacets
      }
    },
    visibleCategories: function() {
      return this.showFundingFacet ? 
        [ANATOMICAL_FOCUS_CATEGORY_ID, FUNDING_CATEGORY_ID] :
        [ANATOMICAL_FOCUS_CATEGORY_ID]
    },
    selectedAnatomicalFocusIds: function() {
      return pluck('id', this.selectedAnatomicalFocusFacets).toString()
    },
    selectedFundingIds: function() {
      return pluck('id', this.selectedFundingFacets).toString()
    },
    selectedFacets: function() {
      let facets = []
      if (this.selectedAnatomicalFocusFacets !== []) {
        this.selectedAnatomicalFocusFacets.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: this.anatomicalFocusCategory.id
          })
        })
      }
      if (this.selectedFundingFacets !== []) {
        this.selectedFundingFacets.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: this.fundingCategory.id
          })
        })
      }
      return facets
    },
  },

  mounted() {
    if (this.$route.query.selectedProjectsAnatomicalFocusIds) {
      this.defaultCheckedAnatomicalFocusIds = this.$route.query.selectedProjectsAnatomicalFocusIds.split(",")
    }
    if (this.$route.query.selectedProjectsFundingIds) {
      this.defaultCheckedFundingIds = this.$route.query.selectedProjectsFundingIds.split(",")
    }
  },

  methods: {
    onAnatomicalFacetSelectionChange: function(data) {
      this.selectedAnatomicalFocusFacets = data.checkedNodes
      const selectedFacetIds = this.selectedAnatomicalFocusFacets.length === 0 ? undefined : this.selectedAnatomicalFocusIds

      this.$router.replace({
        query: { 
          ...this.$route.query, 
          selectedProjectsAnatomicalFocusIds: selectedFacetIds
        }
      }).then(() => {
        this.$emit('projects-selections-changed')
      })
    },
    onFundingFacetSelectionChange: function(data) {
      this.selectedFundingFacets = data.checkedNodes
      const selectedFacetIds = this.selectedFundingFacets.length === 0 ? undefined : this.selectedFundingIds

      this.$router.replace({
        query: { 
          ...this.$route.query, 
          selectedProjectsFundingIds: selectedFacetIds
        }
      }).then(() => {
        this.$emit('projects-selections-changed')
      })
    },
    getSelectedAnatomicalFocusTypes: function() {
      return this.selectedAnatomicalFocusFacets.length > 0 ? this.selectedAnatomicalFocusIds : undefined
    },
    getSelectedFundingTypes: function() {
      return this.selectedFundingFacets.length > 0 ? this.selectedFundingIds : undefined
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            selectedProjectsAnatomicalFocusIds: undefined,
            selectedFundingIds: undefined
          }
        },
        () => {
          this.$emit('projects-selections-changed')
          this.$refs.anatomicalFocusCategory.uncheckAll()
          this.$refs.fundingCategory.uncheckAll()
        }
      )
    },
    deselectFacet(id) {
      this.$refs.anatomicalFocusCategory.uncheck(id)
      this.$refs.fundingCategory.uncheck(id)
    },
    expandAllCategories() {
      this.$refs.anatomicalFocusCategory.setCollapsed(false)
      this.$refs.fundingCategory.setCollapsed(false)
    },
	}
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.dataset-facet-menu > .sparc-design-system-component-dropdown-multiselect:not(:last-child) {
  border-bottom: none;
}

hr {
  margin: 0;
  border: none;
  border-bottom: 1px solid $lineColor2;
}

::v-deep .el-link .el-link--inner {
  text-decoration: underline;
  text-transform: none;
  color: $purple;
  a:hover {
    text-decoration: none;
  }
}
//el-link adds a component with a border in order to underline the text.
//The underline is too low so we cannot use it, and must instead hide it
.el-link.el-link--default:after {
  border: none;
}

.flex {
  display: flex;
  border-left: 1px solid $lineColor2;
  border-right: 1px solid $lineColor2;
  .el-link {
    margin: .5rem .75rem .5rem auto;
  }
}

.expand-all-container {
  background-color: white;
}

</style>

