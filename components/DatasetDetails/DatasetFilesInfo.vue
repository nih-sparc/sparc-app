<template>
  <div class="dataset-files-info">
    <files-table :dataset-details="datasetDetails" />
  </div>
</template>

<script>
import FilesTable from '@/components/FilesTable/FilesTable.vue'
export default {
  name: 'DatasetFilesInfo',

  components: {
    FilesTable
  },

  props: {
    datasetDetails: {
      type: Object,
      default: () => {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
