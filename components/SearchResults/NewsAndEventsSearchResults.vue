
<template>
	<div>
		<event-search-results v-if="this.$route.query.newsAndEventsType === 'event'" :tableData="tableData" />
    <news-search-results  v-else :tableData="tableData"/>
	</div>
</template>

<script>
import NewsSearchResults from './NewsSearchResults.vue'
import EventSearchResults from './EventSearchResults.vue'

export default {
  name: 'NewsAndEventsSearchResults',

	components: {
		NewsSearchResults,
		EventSearchResults
  },

  props: {
    tableData: {
      type: Array,
      default: () => []
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
