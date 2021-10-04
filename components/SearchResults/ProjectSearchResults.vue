<template>
  <el-table
    :data="tableData"
    :show-header="false"
    empty-text="No Results"
  >
    <el-table-column width="160">
      <template slot-scope="scope">
        <img
          v-if="scope.row.fields.institution"
          class="img-project"
          :src="getImageSrc(scope)"
          :alt="getImageAlt(scope)"
        />
      </template>
    </el-table-column>

    <el-table-column min-width="400">
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
        <div class="mt-8 mb-8">
          {{ scope.row.fields.shortDescription }}
        </div>
        <table class="property-table">
          <tr v-if="scope.row.fields.institution">
            <td class="property-name-column">
              Lead Institution
            </td>
            <td>
              {{scope.row.fields.institution.fields.name}}
            </td>
          </tr>
          <tr v-if="scope.row.fields.principleInvestigator">
            <td class="property-name-column">
              Principle Investigator
            </td>
            <td>
              {{reverseName(scope.row.fields.principleInvestigator)}}
            </td>
          </tr>
          <tr v-if="scope.row.fields.awardId">
            <td class="property-name-column">
              NIH Award
            </td>
            <td>
              <a :href="getNihReporterUrl(scope)" target="_blank">
                {{ scope.row.fields.awardId }}
              </a>
            </td>
          </tr>
          <tr v-if="scope.row.fields.projectSection">
            <td class="property-name-column">
              Anatomical Focus
            </td>
            <td>
              {{scope.row.fields.projectSection.fields.title}}
            </td>
          </tr>
        </table>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Truncate from '@/mixins/truncate'

export default {
  name: 'ProjectSearchResults',

  mixins: [Truncate],

  props: {
    tableData: {
      type: Array,
      default: () => []
    },
  },

  methods: {
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageSrc: function(scope) {
      return scope.row.fields.institution.fields.logo
        ? scope.row.fields.institution.fields.logo.fields.file.url
        : ''
    },
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageAlt: function(scope) {
      return scope.row.fields.institution.fields.logo
        ? scope.row.fields.institution.fields.logo.fields.file.description
        : `Logo for ${scope.row.fields.institution.fields.name}`
    },

    /**
     * Get NIH Report Url
     * @param {Object} scope
     * @returns {String}
     */
    getNihReporterUrl: function(scope) {
      return scope.row.fields.nihReporterUrl || '#'
    },

    /**
     * Get short description for dataset
     * @param {Object} scope
     * @returns {String}
     */
    getShortDescription: function(scope) {
      return scope.row.fields.shortDescription || ''
    },

    // Return name in the form last, first
    reverseName: function(name) {
      const fullName = name.split(" ");
      if (fullName.length < 2) {
        return name
      }
      if (fullName.length === 2){
        return `${fullName[1]}, ${fullName[0]}`
      }
      return `${fullName[2]}, ${fullName[0]} ${fullName[1]}`
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
.img-project {
  height: auto;
  width: 100%;
}
.el-table--enable-row-hover .el-table__body tr {
  background-color: transparent;
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
