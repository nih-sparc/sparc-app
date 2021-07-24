<template>
	<div class="facets">
    <h2 class="title">Refine results</h2>
    <hr/>
    <div class="tags-section">
      <span class="flex">
        Filters applied:
        <el-link @click="deselectAllFacets">Reset all</el-link>
      </span>
      <hr/>
      <el-card shadow="never" class="facet-card">
        <span v-if="selectedFacets.length == 0" class="no-facets">No filters applied</span>
        <el-tag v-for="facet in selectedFacets" :key="facet.id" disable-transitions closable @close="deselectFacet(facet.id)">
          {{facet.label}}
        </el-tag>
      </el-card>
    </div>
    <hr/>
		<el-tree
			:data='facets'
			node-key="id"
			indent=0
      show-checkbox
      @check='onFacetChecked'
			:expand-on-click-node="false"
			:render-content="renderTreeNode"
      ref="tree">
		</el-tree>
	</div>
</template>

<script>

export default {
  
  name: 'FacetMenu',

  components: {  },

  props: {
    // The facets to be displayed in the menu
    facets: {
      type: Array,
      default: () => []
    },
  },

  mounted: function() {
    this.$nextTick(function () {
      console.log("MOUNTED CALLED")
      console.log("FACETS WITH SHOW ALL =", this.facets)
      this.facets.forEach(facet => {
        if (facet.children.length > 1 && facet.children[0].id != facet.label)
        {
          const showAllNode = { id: facet.label, label:'Show all', children:[] }
          this.$refs.tree.insertBefore(showAllNode, facet.children[0])
          // default is to show all
          this.$refs.tree.setChecked(showAllNode, true, false)
        }
      })      
    })
  },

  data() {
    return {
      // The facets that are selected by the user
      selectedFacets: [],
    }
  },

  methods: {
    renderTreeNode(h, { node, data, store }) {
      var customClasses = "custom-tree-node";
      if (!node.isLeaf) {
        if (data.children.length > 1)
        {
          customClasses += " childrenGreaterThanNine"
        }
      }
      console.log("NODE DATA = ",node)
      return (
        <span class={customClasses}>
          <h3>{node.label}</h3>
        </span>);
    },
    // If the facet is a top level facet then it is one of the categories and cannot be selected,
    // We can only hide the checkbox so it still shows up as selected when all its children are checked
    isTopLevelNode(node) {
      return node.level <= 1;
    },
    onFacetChecked(clickedNode, treeStatus) {
      if (clickedNode.label == 'Show all')
      {
        const node = this.$refs.tree.getNode(clickedNode);
        // Un-check all it's siblings
        this.$refs.tree.setChecked(node.parent, node.checked, true)
      }
      
      this.selectedFacets = this.$refs.tree.getCheckedNodes().filter(checkedNode => {
          const node = this.$refs.tree.getNode(checkedNode);
          return !this.isTopLevelNode(node) && 
            (node.parent.indeterminate || this.isTopLevelNode(node.parent)) &&
            checkedNode.label != 'Show all'
        })
      this.$emit('selected-facets-changed', this.selectedFacets);
    },
    deselectAllFacets() {
      this.facets.forEach(facet => {
        this.$refs.tree.setChecked(facet.id, false, true)
      });
      this.selectedFacets = []
      this.$emit('selected-facets-changed', this.selectedFacets);
    },
    deselectFacet(id) {
      this.$refs.tree.setChecked(id, false, true)
      this.selectedFacets = this.selectedFacets.filter(facet => facet.id != id)
      this.$emit('selected-facets-changed', this.selectedFacets);
    },
  }
}
</script>

<style lang="scss">
@import '../../assets/_variables.scss';


/*.el-tree-node__children:has(.el-tree-node:first-child:last-child) {
	display: aria-expanded="true";
}

.el-tree-node__children > .el-tree-node:nth-child(1):last-child {
	style: 'aria-expanded="true"'
}*/

.facets {
	background: white;

  h2 {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.2
  }

  .title {
    margin-bottom: 0;
		padding: .5rem 1rem
  }

  hr {
    border: none;
    border-bottom: 1px solid #dbdfe6;
    margin: 0;
  }

  .el-tree-node {
    border-bottom: 1px solid #dbdfe6;
  }

  .el-tree-node__children > .el-tree-node {
    border-bottom: none;
  }

  .el-tree > .el-tree-node > .el-tree-node__content{
    text-transform: uppercase;
    label.el-checkbox {
          display: none
    }
  }

  .el-tree > .el-tree-node {
    padding: .5rem 1rem;
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
    max-height: 10rem;
    overflow-y: auto;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: $median !important;
    background-color: $median !important;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label{
    color: $median !important;
  }
  .el-checkbox__inner:hover{
    border-color: $median !important;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: $median !important;
  }

  .custom-tree-node {
    h3 {
      color: black;
      font-size: 1rem;
      font-weight: 500;
      line-height: 0;
      margin: 0;
    }
  }

  .tags-section {
    margin: .75rem;
    hr {
      padding-bottom: .75rem;
      margin-bottom: .5rem;
    }
    .el-link .el-link--inner {
      text-decoration: underline;
      color: $median;
      a:hover {
        text-decoration: none;
      }
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
      }
      .no-facets {
        font-style: italic;
        opacity: .5;
      }
    }
    //el-link adds a component with a border in order to underline the text.
    //The underline is too low so we cannot use it, and must instead hide it
    .el-link.el-link--default:after {
      border: none;
    }
  }
}
</style>