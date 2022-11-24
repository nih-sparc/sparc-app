<template>
  <el-table
    :data="tableData"
    :show-header="false"
    empty-text="No Results"
  >
    <el-table-column prop="banner" label="Image" width="160">
      <template slot-scope="scope">
        <div v-if="scope.row.pennsieve">
          <nuxt-link
            :to="{
              name: 'datasets-datasetId',
              params: { datasetId: scope.row.object_id },
              query: {
                type: getSearchResultsType(scope.row.item)
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
            <sparc-pill v-if="scope.row.item.published" v-show='scope.row.item.published.status == "embargo"'>
              Embargoed
            </sparc-pill>
          </nuxt-link>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      min-width="400"
    >
      <template slot-scope="scope">
        <div v-if="scope.row.pennsieve">
          <nuxt-link
            :to="{
              name: 'datasets-datasetId',
              params: { datasetId: scope.row.object_id },
              query: {
                type: getSearchResultsType(scope.row.item)
              }
            }"
            v-html="scope.row._highlightResult.item.name.value"
          />
          <div
            class="my-8"
            v-html="scope.row._highlightResult.item.description.value"
          />
          <table class="property-table">
            <tr
              v-for="(property, index) in PROPERTY_DATA"
              v-show="getPropertyValue(scope.row, property)"
              :key="index"
            >
              <td class="property-name-column">
                {{ property.displayName }}
              </td>
              <td
                v-html="getPropertyValue(scope.row, property)"
              />
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
import _ from 'lodash'
import { HIGHLIGHT_TAG } from '~/pages/data/index.vue'

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
      PROPERTY_DATA: [
        {
          displayName: 'Anatomical Structure',
          propPath: '_highlightResult.anatomy.organ'
        },
        {
          displayName: 'Species',
          propPath: '_highlightResult.organisms.primary[0].species.name.value'
        },
        {
          displayName: 'Experimental Approach',
          propPath: '_highlightResult.item.modalities'
        },
        {
          displayName: 'Publication Date',
          propPath: 'pennsieve'
        },
        {
          displayName: 'Samples',
          propPath: 'item.statistics'
        }
      ]
    }
  },

  methods: {
    toTermUppercase: function(term) {
      let value = _.upperFirst(term)
      if (value.indexOf(`<${HIGHLIGHT_TAG}>`) === 0) {
        // If first word is a search term coincidence, set first letter to uppercase
        value = value.slice(0, 3) + value.charAt(3).toUpperCase() + value.slice(4)
      }
      return value
    },
    getPropertyValue: function(item, property) {
      if (item == undefined) {
        return undefined
      }
      switch (property.displayName) {
        case 'Anatomical Structure': {
          const organs = _.get(item, property.propPath)
          return organs
            ? organs.map(item => this.toTermUppercase(item.name.value)).join(', ')
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
        case 'Experimental Approach': {
          const techniques = _.get(item, property.propPath)
          return techniques
            ? techniques
                .map(item => this.toTermUppercase(item.keyword.value))
                .join(', ')
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
          return _.upperFirst(_.get(item, property.propPath))
        }
      }
    },
    getSearchResultsType(item) {
      return item !== undefined ? 
        (item.types[0].name === 'computational model' ? 'simulation' : 'dataset') :
        ''
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
  width: 180px;
  font-weight: bold;
}
</style>
