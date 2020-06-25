<template>
  <div class="dataset-files-info">
    <div class="dataset-link">
      <nuxt-link
        :to="{
          name: 'help-helpId',
          params: {
            helpId: ctfDatasetNavigationInfoPageId
          }
        }"
        class="dataset-link"
      >
        Learn more about navigating a SPARC dataset
      </nuxt-link>
    </div>
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
    }
  },

  data() {
    return {
      ctfDatasetNavigationInfoPageId: process.env.ctf_dataset_navigation_info_page_id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.dataset-files-info {
  .dataset-link {
    font-size: 0.75rem;
    font-weight: bold;
    margin-bottom: 0.625rem;
    text-decoration: none;
  }
}
</style>
