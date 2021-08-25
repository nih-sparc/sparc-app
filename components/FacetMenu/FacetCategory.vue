<template>
  <div class="white-background">
    <h2 class="title">
      {{ facet.label }}
    </h2>
    <div>
      <el-checkbox v-model="showAll" @change="onChangeShowAll" />
      <span>Show all</span>
    </div>
    <el-tree
      ref="tree"
      :data="facet.children"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="treeProps"
      :filter-node-method="filterNode"
      :render-content="renderContent"
      @check-change="onCheckChange"
    />
  </div>
</template>

<script>
import { filter, propOr } from 'ramda'

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
      return Object.keys(this.visibleFacets[this.facet.key])
    }
  },
  watch: {
    allKeys(val) {
      this.$refs.tree.filter(val)
    }
  },

  mounted() {},

  methods: {
    filterNode: function(value, data) {
      if (!value) return true
      return this.allKeys.includes(data.label)
    },
    renderContent(h, { node, data, store }) {
      let nrResults = this.visibleFacets[this.facet.key][node.data.label]
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
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
</style>

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
