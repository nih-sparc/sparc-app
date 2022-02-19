<template>
  <facet-label
    :label="facet.label"
    :tooltip="tooltip"
    :show-help-icon="showHelpIcon"
    :show-collapsible-arrow="showCollapsibleLabelArrow"
    :collapse-by-default="collapseByDefault"
  >
    <hr v-show="showCollapsibleLabelArrow" />
    <div v-show="!hideShowAllOption" class="show-all-node">
      <el-checkbox v-model="showAll" @change="onChangeShowAll">
        Show all
      </el-checkbox>
      <hr />
    </div>
    <div
      :class="[
        'padding-bottom',
        {
          'light-gray-background': showCollapsibleLabelArrow,
          'white-background': !showCollapsibleLabelArrow
        }
      ]"
    >
    <el-form :disabled="!enabled">
      <el-tree
        ref="tree"
        :class="{ 'white-background': !showCollapsibleLabelArrow }"
        :data="facet.children"
        node-key="id"
        show-checkbox
        default-expand-all
        check-on-click-node
        :default-checked-keys="defaultCheckedKeys"
        :props="treeProps"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @check-change="onCheckChange"
      />
    </el-form>
    </div>
  </facet-label>
</template>

<script>
import { propOr, pathOr, pluck } from 'ramda'
import FacetLabel from './FacetLabel.vue'

const tooltipDelay = 800

export default {
  name: 'FacetCategory',

  components: { FacetLabel },

  props: {
    facet: {
      type: Object,
      default: () => {}
    },
    visibleFacets: {
      type: Object,
      default: () => {}
    },
    // Facets to be checked by default when loading the facet menu
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    enabled: {
      type: Boolean,
      default: true
    },
    tooltip: {
      type: String,
      default: ''
    },
    showHelpIcon: {
      type: Boolean,
      default: false
    },
    collapseByDefault: {
      type: Boolean,
      default: true
    },
    hideShowAllOption: {
      type: Boolean,
      default: false
    },
    showCollapsibleLabelArrow: {
      type: Boolean,
      default: true
    },
    showNumberResults: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showAll: true,
      treeProps: {
        label: 'label'
      }
    }
  },
  computed: {
    allKeys: function() {
      return Object.keys(propOr({}, this.facet.key, this.visibleFacets))
    }
  },
  watch: {
    allKeys(val) {
      this.$refs.tree.filter(val)
    },
    'visibleFacets': function() {
      this.setShowAll();
    }
  },

  mounted() {
    if (this.defaultCheckedKeys.length) {
      this.$nextTick(() => {
        /* Work around el-tree component not firing onFacetChecked event when setting default checked keys. When user refreshes page,
         * we need to force selectedFacets to update so that the tags get shown and that the selectedFacets changed event gets fired
         * and notifies the parent that the selected facets have changed so that they can then fetch results */
        this.onCheckChange()
      })
    }
  },

  methods: {
    filterNode: function(value, data) {
      if (!value) return true
      return this.allKeys.includes(data.label)
    },
    // eslint-disable-next-line no-unused-vars
    renderContent(h, { node, data, store }) {
      let nrResults = pathOr(
        0,
        [this.facet.key, node.data.label],
        this.visibleFacets
      )
      let nrResultsClass =
        this.showNumberResults && nrResults > 0
          ? 'tree-counter'
          : 'hide-nr-results'
      return (
        <sparc-tooltip
          placement="left-center"
          content={this.capitalize(node.label)}
        >
          <span slot="item" class="custom-tree-node">
            <span class="capitalize">{node.label}</span>
            <span class={nrResultsClass}>({nrResults})</span>
          </span>
        </sparc-tooltip>
      )
    },
    onChangeShowAll: function(value) {
      if (value) {
        this.uncheckAll()
      } else {
        this.showAll = true
      }
    },
    capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    onCheckChange: function() {
      this.setShowAll()
      this.$emit('selection-change', {
        key: this.facet.key,
        facets: this.$refs.tree.getCheckedNodes(true)
      })
    },
    getSelectedFacets: function() {
      return this.$refs.tree.getCheckedNodes()
    },
    uncheckAll: function() {
      if (this.visibleFacets === undefined)
      {
        this.$refs.tree.setCheckedKeys([])
        return
      }

      const nonVisibleKeys = this.$refs.tree.getCheckedNodes().filter(node => node.facetPropPath === this.facet.key).filter(node => {
        return !this.allKeys.includes(node.label)
      })

      this.$refs.tree.setCheckedKeys(pluck('id', nonVisibleKeys))
    },
    uncheck: function(id) {
      this.$refs.tree.setChecked(id, false, true)
    },
    areAnyVisible: function(facets) {
      if (this.visibleFacets === undefined) { return true }
      let anyVisible = false; 
      facets.map(facet => {
        if (pathOr(undefined, [facet.facetPropPath, facet.label], this.visibleFacets) !== undefined) {
          anyVisible = true
        }
      })
      return anyVisible;
    },
    setShowAll: function() {
      const checked = this.$refs.tree.getCheckedNodes()
      if (!checked.length || !this.areAnyVisible(checked)) {
        this.showAll = true
      } else {
        this.showAll = false
      }
    }
  }
}
</script>

<style>
.tree-counter {
  margin-left: 5px;
  font-size: 12px;
  vertical-align: middle;
}
.hide-nr-results {
  display: none;
}
.capitalize {
  text-transform: capitalize;
}
.custom-tree-node {
  text-overflow: ellipsis;
  overflow: hidden;
}
.light-gray-background .el-tree {
  background: rgb(250, 251, 252);
}
.show-all-node .el-checkbox__label {
  font-size: 16px;
  font-weight: normal;
}
</style>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.show-all-node {
  .el-checkbox {
    padding-right: 0.25rem;
  }
  hr {
    margin: 0.5rem 0;
  }
  margin: 0.5rem 1.5rem;
}

.white-background {
  background: white;
}

.padding-bottom {
  padding-bottom: 0.5rem;
}
</style>
