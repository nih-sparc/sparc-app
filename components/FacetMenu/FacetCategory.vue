<template>
  <facet-label :label="facet.label" :tooltip="tooltip" :showHelpIcon="showHelpIcon">
    <hr>
    <div class="show-all-node">
      <el-checkbox v-model="showAll" @change="onChangeShowAll">
        Show all
      </el-checkbox>
      <hr>
    </div>
    <el-tree
      ref="tree"
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
  </facet-label>
</template>

<script>
import { propOr, pathOr } from 'ramda'
import FacetLabel from './FacetLabel.vue'

const tooltipDelay = 800

export default {
  name: 'FacetCategory',

  components: {FacetLabel},

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
    tooltip: {
      type: String,
      default: ''
    },
    showHelpIcon: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showAll: true,
      treeProps: {
        label: 'label'
      },
    }
  },
  computed: {
    allKeys: function() {
      return Object.keys(propOr({}, this.facet.key, this.visibleFacets))
    },
  },
  watch: {
    allKeys(val) {
      this.$refs.tree.filter(val)
    },
  },

  mounted() {
    if (this.defaultCheckedKeys.length){
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
      return (
        <el-tooltip placement="top-end" transition="none" open-delay={tooltipDelay}>
          <div slot="content" class="capitalize">{node.label}</div>
          <span class="custom-tree-node">
            <span class="capitalize">{node.label}</span>
            <span class="tree-counter">({nrResults})</span>
          </span>
        </el-tooltip>
      )
    },
    onChangeShowAll: function(value) {
      if (value) {
        this.uncheckAll()
      } else {
        this.showAll = true
      }
    },
    onCheckChange: function(data) {
      const checked = this.$refs.tree.getCheckedKeys()
      if (!checked.length) {
        this.showAll = true
      } else {
        this.showAll = false
      }
      this.$emit('selection-change', {
        key: this.facet.key,
        facets: this.$refs.tree.getCheckedNodes(true)
      })
    },
    getSelectedFacets: function() {
      return this.$refs.tree.getCheckedNodes()
    },
    uncheckAll: function() {
      this.$refs.tree.setCheckedKeys([])
    },
    uncheck: function(id) {
      this.$refs.tree.setChecked(id, false, true)
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
.capitalize {
  text-transform: capitalize;
}
.custom-tree-node {
  text-overflow: ellipsis;
  overflow: hidden;
}
.light-gray-background .el-tree {
  background: rgb(250,251,252);
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
    padding-right: .25rem;
  }
  hr {
    margin: .5rem 0;
  }
  margin: .5rem 1.5rem;
}
</style>