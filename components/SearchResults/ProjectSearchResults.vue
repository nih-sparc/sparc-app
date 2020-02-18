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
    <el-table-column label="Image" width="148">
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'projects-projectId',
            params: { projectId: scope.row.sys.id }
          }"
        >
          <img
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
    <el-table-column prop="fields.awardId" label="ID" width="150" />

    <el-table-column
      prop="fields.principleInvestigator"
      label="Principal Investigator"
      width="250"
    />
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
    }
  },

  methods: {
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageSrc: function(scope) {
      return scope.row.fields.institution.image
        ? scope.row.fields.institution.image.fields.file.url
        : ''
    },
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageAlt: function(scope) {
      return scope.row.fields.institution.image
        ? scope.row.fields.institution.image.fields.file.description
        : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
</style>
