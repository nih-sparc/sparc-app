<template>
  <el-table
    :data="tableData"
    :show-header="false"
    empty-text="No Results"
    @sort-change="onSortChange"
  >
    <el-table-column prop="banner" label="Image" width="160">
      <template slot-scope="scope">
        <div v-if="scope.row.item">
          <nuxt-link
            :to="{
              name: 'datasets-datasetId',
              params: { datasetId: scope.row.object_id },
              query: {
                type: $route.query.type
              }
            }"
            class="img-dataset"
          >   
            <img
              v-if="scope.row.pennsieve.banner"
              :src="scope.row.pennsieve.banner.uri"
              :alt="`Banner for ${scope.row.item.name}`"
              height="128"
              width="128"
            />
            <sparc-pill v-show='scope.row.item.published.status == "embargo"'>
              Embargoed
            </sparc-pill>
          </nuxt-link>
        </div>
        <div v-else>
          <nuxt-link
            :to="{
              name: 'datasets-datasetId',
              params: { datasetId: scope.row.objectID },
              query: {
                type: $route.query.type
              }
            }"
            class="img-dataset"
          >
            <img
              v-if="scope.row.banner"
              :src="scope.row.banner"
              :alt="`Banner for ${scope.row.name}`"
              height="128"
              width="128"
            />
            <sparc-pill v-show='scope.row.embargo'>
              Embargoed
            </sparc-pill>
          </nuxt-link>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      min-width="400"
      sortable="custom"
      :sort-orders="sortOrders"
    >
      <template slot-scope="scope">
        <div v-if="scope.row.item">
          <nuxt-link
            :to="{
              name: 'datasets-datasetId',
              params: { datasetId: scope.row.object_id },
              query: {
                type: $route.query.type
              }
            }"
          >
            {{ scope.row.item.name }}
          </nuxt-link>
          <div class="mt-8 mb-8">
            {{ scope.row.item.description }}
          </div>
          <table class="property-table">
            <tr
              v-for="(property, index) in PROPERTY_DATA"
              v-show="getPropertyValue(scope.row, property)"
              :key="index"
            >
              <td class="property-name-column">
                {{ property.displayName }}
              </td>
              <td>
                {{
                  getPropertyValue(scope.row, property)
                }}
              </td>
            </tr>
          </table>
        </div>
        <div v-else>
          <nuxt-link
            :to="{
              name: 'datasets-datasetId',
              params: { datasetId: scope.row.objectID },
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
          <table class="property-table">
            <tr>
              <td class="property-name-column">
                Publication Date
              </td>
              <td>
                {{ 
                  formatDate(scope.row.createdAt) +
                    ' (Last updated ' +
                    formatDate(scope.row.updatedAt) +
                    ')'
                }}
              </td>
            </tr>
          </table>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import SparcPill from '@/components/SparcPill/SparcPill.vue'
import FormatDate from '@/mixins/format-date'
import StorageMetrics from '@/mixins/bf-storage-metrics'
import { onSortChange } from '@/pages/data/utils'
import { pathOr } from 'ramda'
import _ from 'lodash'

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
      sortOrders: ['ascending', 'descending'],
      PROPERTY_DATA: [
        {
          displayName: 'Anatomical Structure',
          propPath: 'anatomy.organ'
        },
        {
          displayName: 'Species',
          propPath: 'organisms.primary[0].species.name'
        },
        {
          displayName: 'Techniques',
          propPath: 'item.techniques'
        },
        {
          displayName: 'Samples',
          propPath: 'item.statistics'
        },
        {
          displayName: 'Publication Date',
          propPath: 'pennsieve'
        },
        {
          displayName: 'Includes',
          propPath: 'item.published.boolean'
        }
      ]
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
    getPropertyValue: function(item, property) {
      if (item == undefined) {
        return undefined
      }
      switch (property.displayName) {
        case 'Anatomical Structure': {
          const organs = _.get(item, property.propPath)
          return organs
            ? organs.map(item => _.upperFirst(item.name)).join(', ')
            : undefined
        }
        case 'Includes': {
          const published = _.get(item, property.propPath)
          return (published == undefined || published == 'false') ? undefined : 'Publications'
        }
        case 'Samples': {
          const sampleCount = _.get(item, property.propPath + '.samples.count')
          const subjectCount = _.get(
            item,
            property.propPath + '.subjects.count'
          )
          return sampleCount && subjectCount
            ? `${sampleCount} samples from ${subjectCount} subjects`
            : undefined
        }
        case 'Techniques': {
          const techniques = _.get(item, property.propPath)
          return techniques
            ? techniques
                .map(item => _.upperFirst(item.keyword))
                .join(', ')
                .replaceAll(' technique', '')
            : undefined
        }
        case 'Publication Date': {
          const pennsieve = _.get(item, property.propPath)
          const createdAt = pennsieve.createdAt.timestamp.split(",")[0]
          const updatedAt = pennsieve.updatedAt.timestamp.split(",")[0]
          return this.formatDate(createdAt) +
                    ' (Last updated ' +
                    this.formatDate(updatedAt) +
                    ')'
        }
        default: {
          return _.get(item, property.propPath)
        }
      }
    },

    onSortChange: function(payload) {
      onSortChange(this, payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}

.el-table--enable-row-hover .el-table__body tr {
  background-color: transparent;
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
.property-table {
  td {
    background-color: transparent;
    padding: 0.25rem 0 0 0;
    border: none;
  }
  background-color: transparent;
  border: none;
  padding: 0;
}
// The outermost bottom border of the table. Element UI adds psuedo elements to create the bottom table border that we must hide to remove
table:not([class^='el-table__'])::before {
  display: none;
}
.property-name-column {
  width: 160px;
  font-weight: bold;
}
</style>
