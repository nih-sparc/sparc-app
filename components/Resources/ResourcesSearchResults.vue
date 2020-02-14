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
            name: 'organs-organId',
            params: { organId: scope.row.sys.id }
          }"
        >
          {{ scope.row.fields.name }}
        </nuxt-link>
      </template>
    </el-table-column>
    <!-- <el-table-column :fixed="true" prop="fields.title" label="Banner">
      <template slot-scope="scope">
        <img
          :src="getImageSrc(scope)"
          :alt="getImageAlt(scope)"
          height="128"
          width="128"
        />
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
export default {
  name: 'ResourceSearchResults',
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
