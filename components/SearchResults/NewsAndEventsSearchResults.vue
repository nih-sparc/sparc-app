<template>
  <div>
    <event-search-results
      v-if="this.$route.query.newsAndEventsType === 'event'"
      :table-data="tableData"
    />
    <news-search-results v-else :table-data="tableData" />
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
