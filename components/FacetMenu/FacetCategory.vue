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
      indent="0"
      show-checkbox
      default-expand-all
      @check-change="onCheckChange"
    />
  </div>
</template>

<script>
export default {
  name: 'FacetCategory',

  components: {},

  props: {
    facet: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      showAll: true
    }
  },

  mounted() {},

  methods: {
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
        console.log('should show all')
        this.showAll = true
      } else {
        this.showAll = false
      }
    },
    uncheckAll: function() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

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
