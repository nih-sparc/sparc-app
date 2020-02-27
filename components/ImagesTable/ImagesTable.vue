<template>
  <el-table :data="tableData" empty-text="No Results">
    <el-table-column :fixed="true" prop="image_id" label="ID" width="300">
      <template slot-scope="scope">
        <!-- <nuxt-link
          :to="{
            name: 'file-datasetId-datasetVersion-path,
            params: {
              datasetId
             }
          }"
        > -->
        {{ scope.row.image_id }}
        <!-- </nuxt-link> -->
      </template>
    </el-table-column>
    <el-table-column prop="share_link" label="Link" />
  </el-table>
</template>

<script>
export default {
  name: 'ImagesTable',

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
.img-image {
  height: auto;
  width: 100%;
}
</style>
