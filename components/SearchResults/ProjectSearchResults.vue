<template>
  <el-table :data="tableData">
    <el-table-column
      :fixed="true"
      prop="fields.title"
      label="Title"
      width="300"
    >
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'projects-projectId',
            path: 'projects/:scope.row.sys.id',
            params: { projectId: scope.row.sys.id }
          }"
        >
          {{ scope.row.fields.title }}
        </nuxt-link>
      </template>
    </el-table-column>
    <el-table-column prop="fields.awardId" label="ID" width="150" />
    <el-table-column
      prop="fields.principleInvestigator"
      label="Principle Investigator"
      width="250"
    />
    <el-table-column
      prop="fields.description"
      label="description"
      width="500"
    />
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
