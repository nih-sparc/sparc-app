<template>
  <!-- Alternative search suggestions NNOTE that this is currently just copy and pasted from /data/index.vue -->
  <div v-if="searchHasAltResults">
    <br />
    <template v-if="!searchHadResults">
      No results were found for <strong><i>{{ this.$route.query.search }}</i></strong>.
    </template>
    The following results were discovered for the other categories:
    <br />
    <br />
    <template v-for="dataType in dataTypes">
      <dd v-if="resultCounts[dataType] > 0" :key="dataType">
        <nuxt-link
          :to="{
            name: `resources-${dataType}`,
            query: {
              ...$route.query
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
import { fetchResources } from '@/pages/resources/utils.ts'

function getLastUrlSegment(path) {
  return path
    .split('/')
    .filter(Boolean)
    .pop()
}

export default {
  name: 'AlternativeSearchResults',
  props: {
    searchHadResults: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      searchHasAltResults: false,
      dataTypes: [
        'biological',
        'databases',
        'devices',
        'information-services',
        'software'
      ],
      humanReadableDataTypesLookup: {
        biological: 'Biologicals',
        databases: 'Data and Models',
        devices: 'Devices',
        'information-services': 'Information Services',
        software: 'Software'
      },
      resultCounts: {
        biological: 0,
        databases: 0,
        devices: 0,
        'information-services': 0,
        software: 0
      }
    }
  },
  computed: {
    dataTypeSeleced: function() {
      return getLastUrlSegment(this.$route.path)
    }
  },
  methods: {
    retrieveAltTotals: function() {
      this.searchHasAltResults = false
      for (let key in this.resultCounts) {
        // reset reults list
        this.resultCounts[key] = 0
      }
      let altSearchTypes = this.dataTypes.filter(
        e => e !== this.dataTypeSeleced
      ) // Remove from list of data types

      altSearchTypes.forEach(type => {
        // Search on each data type remaining
        this.retrieveAltTotal(type)
      })
    },
    retrieveAltTotal: function(category) {
      fetchResources(
        this.humanReadableDataTypesLookup[category], // needed as human readable is used for contentful
        this.$route.query.search,
        undefined,
        undefined,
        10,
        0
      )
        .then(resp => {
          this.resultCounts[category] = resp.total
          resp.total > 0 ? (this.searchHasAltResults = true) : null
        })
        .catch(err => {
          console.log('Error in alternative Search results call:', err)
          this.resultCounts[category] = 0
        })
    }
  }
}
</script>

<style></style>
