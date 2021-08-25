<template>
  <div class="white-background">
    <hr />
    <h2 class="title">
      {{ facet.label }}
      <svg-icon
        @click="() => collapsed = !collapsed"
        class="ml-8 icon-arrow"
        name="icon-arrow"
        :dir="collapsibleArrowDir"
        height="15"
        width="15"
      />
    </h2>
    <div v-show="!collapsed" class="light-gray-background">
      <hr>
      <div class="show-all-node">
        <el-checkbox v-model="showAll" @change="onChangeShowAll" />
        <span>Show all</span>
        <hr>
      </div>
      <el-tree
        ref="tree"
        :data="facet.children"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="treeProps"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @check-change="onCheckChange"
      />
    </div>
  </div>
</template>

<script>
import { propOr, pathOr } from 'ramda'

export default {
  name: 'FacetCategory',

  components: {},

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
    }
  },

  data() {
    return {
      showAll: true,
      treeProps: {
        label: 'label'
      },
      collapsed: false
    }
  },
  computed: {
    allKeys: function() {
      return Object.keys(propOr({}, this.facet.key, this.visibleFacets))
    },
    collapsibleArrowDir: function() {
      return this.collapsed ? 'up' : 'down'
    }
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
        <span class="custom-tree-node">
          <el-tooltip
            content={node.label}
            popper-class="capitalize"
            open-delay="700"
            transition="none"
            placement="top-start"
          >
            <span class="capitalize">{node.label}</span>
          </el-tooltip>
          <span class="tree-counter">({nrResults})</span>
        </span>
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
  background: rgb(250, 250, 250);
}
</style>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.white-background {
  background-color: white;
}

.light-gray-background {
  background-color: rgb(250, 250, 250);
}

.show-all-node {
  .el-checkbox {
    padding-right: .25rem;
  }
  hr {
    margin: .5rem 0;
  }
  margin: .5rem 1.5rem;
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0.5rem 1rem;
}

hr {
  border: none;
  border-bottom: 1px solid #dbdfe6;
  margin: 0;
}
</style>