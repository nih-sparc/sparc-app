<template>
  <div>
    <help-search-results
      v-if="this.$route.query.sparcInfoType === 'helpDocument'"
      :table-data="tableData"
    />
    <project-search-results
      v-if="this.$route.query.sparcInfoType === 'sparcAward'"
      :table-data="tableData"
    />
    <about-details-search-results v-else :table-data="tableData" />
  </div>
</template>

<script>
import AboutDetailsSearchResults from './AboutDetailsSearchResults.vue'
import HelpSearchResults from './HelpSearchResults.vue'
import ProjectSearchResults from './ProjectSearchResults.vue'

export default {
  name: 'SparcInfoSearchResults',

  components: {
    AboutDetailsSearchResults,
    HelpSearchResults,
    ProjectSearchResults
  },

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped></style>
