<template>
  <div class="page-data pb-16">
    <breadcrumb :breadcrumb="breadcrumb" :title="searchType.label" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Browse Metrics
        </h3>
        <ul class="search-tabs">
          <li v-for="type in metricsTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.type === $route.query.metricsType }"
              :to="{
                name: 'about-metrics',
                query: {
                  ...$route.query,
                  metricsType: type.type,
                }
              }"
            >
              {{ type.label }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="container mt-16">
      <component
        :is="metricsComponent"
        :metrics-data="metricsData"
      />
    </div>
  </div>
</template>
<script>

import {
  compose,
  defaultTo,
  find,
  head,
  pathOr,
  propEq,
  propOr
} from 'ramda'
import { getPreviousDate } from '@/utils/common'
import ErrorMessages from '@/mixins/error-messages'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'

const UserBehaviorsMetrics = () =>
  import('@/components/Metrics/UserBehaviors.vue')
const ScientificContributionMetrics = () =>
  import('@/components/Metrics/ScientificContribution.vue')

const metricsComponents = {
  userBehaviors: UserBehaviorsMetrics,
  scientificContribution: ScientificContributionMetrics,
}

const metricsTypes = [
  {
    label: 'Scientific Contribution',
    type: 'scientificContribution',
    dataSource: ''
  },
  {
    label: 'User Behaviors',
    type: 'userBehaviors',
    dataSource: ''
  }
]

const fetchMetrics = async (axios, month, year) => {
  let ga4MetricsData = await axios.get(`${process.env.METRICS_URL}/ga4?year=${year}&month=${month}`)
  ga4MetricsData = ga4MetricsData.data[0]
  let pennsieveMetricsData = await axios.get(`${process.env.METRICS_URL}/pennsieve?year=${year}&month=${month}`)
  pennsieveMetricsData = pennsieveMetricsData.data[0]
  let sparcMetricsData = await axios.get(`${process.env.METRICS_URL}/sparc?year=${year}&month=${month}`)
  sparcMetricsData = sparcMetricsData.data[0]

  const top5AnatomicalStructuresObject = sparcMetricsData['anatomical_structures_breakdown']['M']
  let top5AnatomicalStructuresArray = []
  // convert the response object into an object array of the form { 'name': <structure name>, 'value': <number of structures>}
  Object.keys(top5AnatomicalStructuresObject).forEach(key => top5AnatomicalStructuresArray.push({
    name: key,
    value: parseInt(top5AnatomicalStructuresObject[key]['N'])
  }))
  return {
    userBehaviors: {
      pageViewsLabels: ['Homepage', 'Find Data', 'Tools & Resources', 'Maps', 'News & Events'],
      pageViewsData: {
        lastMonth: [parseInt(ga4MetricsData['all_home_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_find_data_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_tools_resources_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_maps_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_news_events_page_views_last_mo']['N'])],
        last3Months: [parseInt(ga4MetricsData['all_home_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_find_data_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_tools_resources_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_maps_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_news_events_page_views_last_quarter']['N'])]
      },
      usersData: {
        lastMonth: [parseInt(ga4MetricsData['returning_users_in_last_month']['N']), parseInt(ga4MetricsData['new_users_in_last_month']['N'])],
        last3Months: [parseInt(ga4MetricsData['returning_users_in_last_quarter']['N']), parseInt(ga4MetricsData['new_users_in_last_quarter']['N'])]
      },
      totalDownloadsData: {
        lastMonth: parseInt(pennsieveMetricsData['number_of_sparc_downloads_last_mo']['N']),
        last3Months: parseInt(pennsieveMetricsData['number_of_sparc_downloads_last_quarter']['N'])
      },
      datasetContributorsData: {
        total: parseInt(pennsieveMetricsData['number_of_sparc_users_overall']['N']),
        newLastMonth: parseInt(pennsieveMetricsData['number_of_new_sparc_users_last_quarter']['N'])
      },
    },
    scientificContribution: {
      dataChartLabels: ['All', 'Datasets', 'Anatomical Models', 'Computational Models', 'Embargoed (across all)'],
      dataChartData: {
        total: [parseInt(sparcMetricsData['all_sparc_categories_cumulative']['N']), parseInt(sparcMetricsData['sparc_datasets_cumulative']['N']), parseInt(sparcMetricsData['sparc_maps_cumulative']['N']), parseInt(sparcMetricsData['sparc_computational_models_cumulative']['N']), parseInt(sparcMetricsData['embargoed_overall']['N'])],
        lastMonth: [parseInt(sparcMetricsData['all_sparc_categories_last_mo']['N']), parseInt(sparcMetricsData['new_sparc_datasets_last_1_mo']['N']), parseInt(sparcMetricsData['sparc_maps_cumulative']['N']), parseInt(sparcMetricsData['new_sparc_computational_models_last_1_mo']['N'])],
        last3Months: [parseInt(sparcMetricsData['all_sparc_categories_last_quarter']['N']), parseInt(sparcMetricsData['new_sparc_datasets_last_quarter']['N']), parseInt(sparcMetricsData['sparc_maps_cumulative']['N']), parseInt(sparcMetricsData['new_sparc_computational_models_last_quarter']['N'])]
      },
      samples: {
        total: parseInt(sparcMetricsData['number_of_samples_cumulative']['N']),
        newLastMonth: parseInt(sparcMetricsData['number_of_samples_last_mo']['N']),
        newLast3Months: parseInt(sparcMetricsData['number_of_samples_last_quarter']['N']),
      },
      subjects: {
        total: parseInt(sparcMetricsData['number_of_subjects_cumulative']['N']),
        newLastMonth: parseInt(sparcMetricsData['number_of_subjects_last_month']['N']),
        newLast3Months: parseInt(sparcMetricsData['number_of_subjects_last_quarter']['N']),
      },
      anatomicalStructures: {
        total: parseInt(sparcMetricsData['current_number_of_anatomical_structures']['N'])
      },
      anatomicalStructuresChartLabels: top5AnatomicalStructuresArray.map(structure => structure.name),
      anatomicalStructuresChartData: top5AnatomicalStructuresArray.map(structure => structure.value),
      fileStorage: {
        totalGB: parseInt(pennsieveMetricsData['total_number_gigabytes']['N'])
      }
    }
  }
}

export default {
  name: 'MetricsPage',

  components: {
    Breadcrumb,
    Error
  },

  async asyncData({ $axios, error }) {
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    // we use last months date to get the metrics bc the metrics for the current month aren't published until the end of the month
    const lastMonthsDate = getPreviousDate(currentMonth, currentYear)
    let metricsData = undefined
    try {
      metricsData = await fetchMetrics($axios, lastMonthsDate.month, lastMonthsDate.year)
    } catch (e) {
      const monthBeforeLastDate = getPreviousDate(lastMonthsDate.month, lastMonthsDate.year)
      metricsData = await fetchMetrics($axios, monthBeforeLastDate.month, monthBeforeLastDate.year).catch(() => {
        error({ statusCode: 400, message: ErrorMessages.methods.metrics(), display: true, error: e } )
      })
    }
    return {
      metricsData
    }
  },

  data: () => {
    return {
      metricsTypes,
      isLoadingMetrics: false,
      searchFailed: false,
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          label: 'About SPARC',
          to: {
            name: 'about'
          }
        },
        {
          to: {
            name: 'about-metrics',
            query: {
              metricsType: 'scientificContribution'
            }
          },
          label: 'Metrics'
        },
      ]
    }
  },

  computed: {
    /**
     * Compute search type
     * @returns {String}
     */
    searchType: function() {
      const metricsTypeQuery = pathOr('', ['query', 'metricsType'], this.$route)
      const metricsType = find(propEq('type', metricsTypeQuery), this.metricsTypes)

      return defaultTo(head(this.metricsTypes), metricsType)
    },

    /**
     * Compute which search results component to display based on the type of search
     * @returns {Function}
     */
    metricsComponent: function() {
      return defaultTo('', metricsComponents[this.$route.query.metricsType])
    },
  },
  /**
   * Check the metricsType param in the route and set it if it
   */
  mounted: function() {
    if (!this.$route.query.metricsType) {
      const firstTabType = compose(propOr('', 'type'), head)(metricsTypes)
      this.$router.replace({ query: { metricsType: firstTabType } })
    }
  },
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.page-data {
  background-color: $background;
}
.search-tabs__container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: white;
  border: 0.1rem solid $lineColor2;
  h3 {
    padding-left: 0.75rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
}
.search-tabs {
  display: flex;
  list-style: none;
  overflow: auto;
  margin: 0 0 0 0;
  padding: 0 0;
  outline: 0.1rem solid $purple;
  @media (max-width: 40rem) {
    display: block;
  }
  li {
    width: 100%;
    text-align: center;
    color: $purple;
  }
  li:last-child > a {
    border-right: none;
  }
}
.search-tabs__button {
  background: #f9f2fc;
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  outline: none;
  padding: 0;
  text-decoration: none;
  text-transform: uppercase;
  line-height: 3.5rem;
  @media (min-width: 40rem) {
    font-size: 0.65rem;
    border-right: 0.1rem solid $purple;
  }
  @media (min-width: 50rem) {
    font-size: .75rem;
  }
  @media (min-width: 64rem) {
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: none;
  }
  &:hover,
  &.active {
    color: white;
    background-color: $purple;
    font-weight: 500;
  }
}
.table-wrap {
  background: white;
  border: 1px solid $lineColor2;
  padding: 1rem;
  .search-error {
    margin: 0 0  auto;
    text-align:center;
  }
}
</style>
