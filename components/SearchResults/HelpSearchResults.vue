<template>
  <el-table :data="tableData">
    <el-table-column :fixed="true" prop="title" label="Title" width="300" />
    <el-table-column prop="summary" label="Summary" />
  </el-table>
</template>

<script>
export default {
  name: 'HelpSearchResults',

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
</style>
