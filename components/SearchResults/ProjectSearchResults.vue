<template>
  <el-table :data="tableData">
    <el-table-column :fixed="true" prop="title" label="Title" width="300" />
    <el-table-column prop="awardId" label="ID" width="150" />
    <el-table-column
      prop="principleInvestigator"
      label="Principle Investigator"
      width="250"
    />
    <el-table-column prop="description" label="description" width="500" />
  </el-table>
</template>

<script>
export default {
  name: 'ProjectSearchResults',

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
