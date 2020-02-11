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
            name: 'datasets-datasetId',
            params: { datasetId: scope.row.id },
            query: {
              type: $route.query.type
            }
          }"
        >
          {{ scope.row.name }}
        </nuxt-link>
      </template>
    </el-table-column>
    <el-table-column prop="banner" label="Image" width="148">
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'datasets-datasetId',
            params: { datasetId: scope.row.id }
          }"
        >
          <img
            :src="scope.row.banner"
            :alt="`Banner for ${scope.row.name}`"
            height="128"
            width="128"
          />
        </nuxt-link>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="Description" width="400" />
    <el-table-column prop="createdAt" label="Date" width="200">
      <template slot-scope="scope">
        {{ formatDate(scope.row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column prop="size" label="Size" width="150">
      <template slot-scope="scope">
        {{ formatMetric(scope.row.size) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import FormatDate from '@/mixins/format-date'
import StorageMetrics from '@/mixins/bf-storage-metrics'

export default {
  name: 'DatasetSearchResults',

  mixins: [FormatDate, StorageMetrics],

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
