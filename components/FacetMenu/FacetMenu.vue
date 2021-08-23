<template>
  <div class="facet-menu">
    <el-tree
      ref="tree"
      :data="facets"
      node-key="id"
      indent="0"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      :default-checked-keys="defaultCheckedFacetIds"
      :filter-node-method="hideFacets"
      :render-content="renderTreeNode"
      @check="onFacetChecked"
      :key="facets.length"
    />
  </div>
</template>

<script>
export default {
  name: 'FacetMenu',

  components: {},

  props: {
    // All facets contained in the menu
    facets: {
      type: Array,
      default: () => []
    },
    // Setting visibleFacets hides all other facets
    visibleFacets: {
      type: Object,
      default: () => {}
    },
    // Facets to be checked by default when loading the facet menu
    defaultCheckedFacetIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      // The facets that are selected by the user
      selectedFacets: [],
    }
  },

  watch: {
    "visibleFacets": function(facets) {
      this.$refs.tree.filter(facets)
    },
    'facets': function(facets){
      if (facets.length){
        this.$nextTick(() => {
          /* Work around el-tree component not firing onFacetChecked event when setting default checked keys. When user refreshes page, 
           * we need to force selectedFacets to update so that the tags get shown and that the selectedFacets changed event gets fired 
           * and notifies the parent that the selected facets have changed so that they can then fetch results */
          this.onFacetChecked()
        })
      } 
    }
  },

  methods: {
    renderTreeNode(h, { node, data, store }) {
      var customClasses = 'custom-tree-node'
      return this.isTopLevelNode(node) ? (
        <span class={customClasses}>
          <span class="label uppercase">{node.label}</span>
          <el-link on-click={() => this.deselectAllChildrenFacets(data)}>
            Reset
          </el-link>
        </span>
      ) : (
        <span class={customClasses}>
          <el-tooltip content={node.label} popper-class="capitalize" transition="none" open-delay="700" placement="top-start">
            <span class="label capitalize">{node.label}</span>
          </el-tooltip>
        </span>
      )
    },
    hideFacets(value, data, node) {
      const facetChildren = value[data.facetPropPath]
      if (facetChildren == undefined) {
        return false
      }
      return facetChildren[data.label] != undefined
    },
    
    // If the facet is a top level facet then it is one of the categories and cannot be selected,
    // We can only hide the checkbox so it still shows up as selected when all its children are checked
    isTopLevelNode(node) {
      return node.level <= 1
    },
    onFacetChecked() {
      this.selectedFacets = this.$refs.tree
        .getCheckedNodes()
        .filter(checkedNode => {
          const node = this.$refs.tree.getNode(checkedNode)
          return (
            !this.isTopLevelNode(node) &&
            (node.parent.indeterminate || this.isTopLevelNode(node.parent))
          )
        })
      this.$emit('selected-facets-changed', this.selectedFacets)
    },
    deselectAllFacets() {
      this.facets.forEach(facet => {
        this.$refs.tree.setChecked(facet.id, false, true)
      })
      this.selectedFacets = []
      this.$emit('selected-facets-changed', this.selectedFacets)
    },
    deselectAllChildrenFacets(node) {
      node.children.forEach(child => {
        this.$refs.tree.setChecked(child.id, false, true)
        this.selectedFacets = this.$refs.tree.getCheckedNodes()
      })
      this.$emit('selected-facets-changed', this.selectedFacets)
    },
    deselectFacet(id) {
      this.$refs.tree.setChecked(id, false, true)
      this.selectedFacets = this.selectedFacets.filter(facet => facet.id != id)
      this.$emit('selected-facets-changed', this.selectedFacets)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/_variables.scss';
.facet-menu {
  .el-tree-node {
    border-bottom: 1px solid #dbdfe6;
  }

  .el-tree-node__children > .el-tree-node {
    border-bottom: none;
  }

  .el-tree > .el-tree-node > .el-tree-node__content {
    label.el-checkbox {
      display: none;
    }
  }

  .el-tree > .el-tree-node {
    padding: 0.5rem 1rem;
  }

  .el-tree-node__content {
    display: flex;
    .el-tree-node__expand-icon {
      order: 3;
      margin-left: auto;
    }
  }

  .el-tree-node__children {
    padding: 0 10px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: $median !important;
    background-color: $median !important;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $median !important;
  }
  .el-checkbox__inner:hover {
    border-color: $median !important;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: $median !important;
  }

  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .custom-tree-node {
    text-overflow: ellipsis;
    overflow: hidden;

    .el-link {
      margin-left: 1rem;
    }
    .label{
      color: black;
      font-size: 1rem;
      font-weight: 500;
      line-height: 0;
      margin: 0;
    }
    .capitalize {
      text-transform: capitalize;
    }
    .uppercase {
      text-transform: uppercase;
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