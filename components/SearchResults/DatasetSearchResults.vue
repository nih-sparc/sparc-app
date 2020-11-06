<template>
  <el-table
    :data="tableData"
    empty-text="No Results"
    @sort-change="onSortChange"
  >
    <el-table-column
      :fixed="true"
      sortable="custom"
      prop="name"
      label="Title"
      :width="titleColumnWidth"
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
            params: { datasetId: scope.row.id },
            query: {
              type: $route.query.type
            }
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
    <el-table-column
      prop="description"
      label="Description"
      :width="areSimulationResults ? 550 : 400"
    />
    <el-table-column
      prop="createdAt"
      label="Last Published"
      width="200"
      sortable="custom"
    >
      <template slot-scope="scope">
        {{ formatDate(scope.row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column
      v-if="!areSimulationResults"
      prop="size"
      label="Size"
      width="150"
      sortable="custom"
    >
      <template slot-scope="scope">
        {{ formatMetric(scope.row.size) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import FormatDate from '@/mixins/format-date'
import StorageMetrics from '@/mixins/bf-storage-metrics'
import { onSortChange } from '@/pages/data/utils'
import { pathOr } from 'ramda'

export default {
  name: 'DatasetSearchResults',

  mixins: [FormatDate, StorageMetrics],

  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    titleColumnWidth: {
      type: Number,
      default: () => 300
    }
  },

  computed: {
    /**
     * Compute if the search results are for simulations
     * @returns {Boolean}
     */
    areSimulationResults: function() {
      const searchType = pathOr('', ['query', 'type'], this.$route)
      return searchType === 'simulation'
    }
  },

  methods: {
    onSortChange: function(payload) {
      console.log("give me payload ", payload)
      onSortChange(this, payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
</style>
