<template>
  <el-table
    :data="tableData"
    :show-header="false"
    empty-text="No Results"
  >
    <el-table-column prop="banner" label="Image" width="160">
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'datasets-datasetId',
            params: { datasetId: scope.row.id },
            query: {
              type: $route.query.type
            }
          }"
          class="img-dataset"
        >
          <img
            :src="scope.row.banner"
            :alt="`Banner for ${scope.row.name}`"
            height="128"
            width="128"
          />
          <sparc-pill v-if="scope.row.embargo">
            Embargoed
          </sparc-pill>
        </nuxt-link>
      </template>
    </el-table-column>
    <el-table-column
      sortable="custom"
      min-width="400"
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
        <div class="mt-8 mb-8">
          {{ scope.row.description }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import SparcPill from '@/components/SparcPill/SparcPill.vue'
import FormatDate from '@/mixins/format-date'
import StorageMetrics from '@/mixins/bf-storage-metrics'
import { pathOr } from 'ramda'

export default {
  name: 'DatasetSearchResults',

  components: { SparcPill },

  mixins: [FormatDate, StorageMetrics],

  props: {
    tableData: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      sortOrders: ['ascending', 'descending']
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
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
.img-dataset {
  display: block;
  position: relative;
  .sparc-pill {
    font-size: 0.75rem;
    position: absolute;
    right: 0.25rem;
    top: 0.5rem;
  }
  img {
    display: block;
  }
}
</style>
