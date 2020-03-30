<template>
  <el-table :data="tableData" empty-text="No Results" @sort-change="onSortChange">
    <el-table-column
      :fixed="true"
      sortable="custom"
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
    <el-table-column label="Image" width="148">
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'projects-projectId',
            params: { projectId: scope.row.sys.id }
          }"
        >
          <img
            class="img-project"
            :src="getImageSrc(scope)"
            :alt="getImageAlt(scope)"
            height="128"
            width="128"
          />
        </nuxt-link>
      </template>
    </el-table-column>
    <el-table-column prop="fields.description" label="Description" width="500">
      <template slot-scope="scope">
        {{ truncateField(scope.row.fields.description) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="fields.institution.fields.name"
      label="Institution"
      width="200"
    />
    <el-table-column sortable="custom" prop="fields.awardId" label="NIH Award" width="150" />

    <el-table-column
      sortable="custom"
      prop="fields.principleInvestigator"
      label="Principal Investigator"
      width="250"
    />
  </el-table>
</template>

<script>
import Truncate from '@/mixins/truncate'
import { onSortChange } from '../../pages/data/utils'

export default {
  name: 'ProjectSearchResults',

  mixins: [Truncate],

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
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
        : ''
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
.img-project {
  height: auto;
  width: 100%;
}
</style>
