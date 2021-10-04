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
  </div>
</template>

<script>
import ProjectSearchResults from './ProjectSearchResults.vue'
import HelpSearchResults from './HelpSearchResults.vue'

export default {
  name: 'SparcInfoSearchResults',

  components: {
    ProjectSearchResults,
		HelpSearchResults
  },

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>