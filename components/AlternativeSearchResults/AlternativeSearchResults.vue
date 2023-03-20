<template>
  <!-- Alternative search suggestions NNOTE that this is currently just copy and pasted from /data/index.vue -->
  <div v-if="searchHasAltResults">
    <template v-if="searchData.total === 0">
      No results were found for {{ searchType.label }}.
    </template>
    The following results were discovered for the other categories:
    <br />
    <br />
    <template v-for="dataType in dataTypes">
      <dd v-if="resultCounts[dataType] > 0" :key="dataType">
        <nuxt-link
          :to="{
            name: 'data',
            query: {
              ...$route.query,
              type: dataType
            }
          }"
        >
          {{ resultCounts[dataType] }} result{{
            resultCounts[dataType] > 1 ? 's' : ''
          }}
        </nuxt-link>
        - {{ humanReadableDataTypesLookup[dataType] }}
      </dd>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AlternativeSearchResults',
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    searchType: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style></style>
