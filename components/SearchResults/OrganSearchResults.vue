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
    <el-table-column :fixed="true" prop="fields.title" label="Banner">
      <template slot-scope="scope">
        <img
          :src="getImageSrc(scope)"
          :alt="getImageAlt(scope)"
          height="128"
          width="128"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { pathOr } from 'ramda'

export default {
  name: 'OrganSearchResults',

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
      return pathOr(
        '',
        ['row', 'fields', 'bannerImage', 'fields', 'file', 'url'],
        scope
      )
    },
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageAlt: function(scope) {
      return pathOr(
        '',
        ['row', 'fields', 'bannerImage', 'fields', 'file', 'description'],
        scope
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
</style>
