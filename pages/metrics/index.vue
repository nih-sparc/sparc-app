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
                name: 'metrics',
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
      <div v-loading="isLoadingMetrics" class="table-wrap">
        <p v-if="searchFailed" class="search-error">
          Sorry, an unexpected error has occured, please try again later.
        </p>
        <component
          v-else
          :is="metricsComponent"
          :metrics-data="metricsData"
        />
      </div>
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
    label: 'User Behaviors',
    type: 'userBehaviors',
    dataSource: ''
  },
  {
    label: 'Scientific Contribution',
    type: 'scientificContribution',
    dataSource: ''
  }
]

const fetchMetrics = async () => {
  /* const ga4MetricsData = await axios.get(`https://metrics.sparc.science/ga4?year=${this.currentYear}&month=${this.currentMonth}`)['body'][0]
  const pennsieveMetricsData = await axios.get(`https://metrics.sparc.science/pennsieve?year=${this.currentYear}&month=${this.currentMonth}`)['body'][0]
  const sparcMetricsData = await axios.get(`https://metrics.sparc.science/sparc?year=${this.currentYear}&month=${this.currentMonth}`)['body'][0] */

  const ga4MetricsData = {
    'all_news_events_page_views_last_quarter': {'N': '222'}, 'all_find_data_page_views_last_quarter': {'N': '222'}, 'all_tools_resources_page_views_last_quarter': {'N': '222'}, 'all_screen_page_views_last_mo': {'N': '12391'}, 'source': {'S': 'ga4'}, 'all_home_page_views_last_mo': {'N': '222'}, 'all_find_data_page_views_last_mo': {'N': '222'}, 'returning_users_in_last_month': {'N': '239'}, 'all_maps_page_views_last_quarter': {'N': '222'}, 'new_users_in_last_quarter': {'N': '1186'}, 'all_tools_resources_page_views_last_mo': {'N': '222'}, 'month': {'N': '1'}, 'year': {'N': '2023'}, 'returning_users_in_last_quarter': {'N': '283'}, 'new_users_in_last_month': {'N': '858'}, 'year_month_source': {'S': '2023_01_ga4'}, 'all_home_page_views_last_quarter': {'N': '222'}, 'all_screen_page_views_last_quarter': {'N': '11392'}, 'all_news_events_page_views_last_mo': {'N': '222'}, 'all_maps_page_views_last_mo': {'N': '222'}
  }
  const pennsieveMetricsData = {
    'number_of_new_sparc_teams_last_mo': {'N': '120'}, 'number_of_aws_downloads_last_3_mo': {'N': '0'}, 'source': {'S': 'pennsieve'}, 'number_of_new_sparc_users_last_3_mo': {'N': '11'}, 'number_of_aws_downloads_last_mo': {'N': '0'}, 'number_of_sparc_downloads_last_mo': {'N': '58'}, 'number_of_sparc_users_overall': {'N': '515'}, 'total_number_gigabytes': {'N': '22904'}, 'number_of_sparc_downloads_last_3_mo': {'N': '118'}, 'month': {'N': '1'}, 'year': {'N': '2023'}, 'number_of_sparc_teams_overall': {'N': '62'}, 'number_of_new_sparc_users_last_mo': {'N': '2'}, 'year_month_source': {'S': '2023_01_pennsieve'}, 'number_of_new_sparc_teams_last_3_mo': {'N': '300'}
  }
  const sparcMetricsData = {
    'number_of_samples_cumulative': {'N': '8065'}, 'new_sparc_computational_models_last_3_mo': {'N': '5'}, 'number_of_samples_last_mo': {'N': '0'}, 'number_of_subjects_last_3_mo': {'N': '0'}, 'all_sparc_categories_cumulative': {'N': '235'}, 'new_sparc_datasets_last_3_mo': {'N': '0'}, 'new_sparc_datasets_last_1_mo': {'N': '0'}, 'sparc_computational_models_cumulative': {'N': '26'}, 'number_of_samples_last_3_mo': {'N': '0'}, 'current_number_of_anatomical_structures': {'N': '43'}, 'all_sparc_categories_last_3_mo': {'N': '21'}, 'year_month_source': {'S': '2023_01_sparc'}, 'number_of_subjects_cumulative': {'N': '2804'}, 'all_sparc_categories_last_mo': {'N': '2'}, 'sparc_maps_cumulative': {'N': '36'}, 'number_of_subjects_last_month': {'N': '0'}, 'source': {'S': 'sparc'}, 'new_sparc_computational_models_last_1_mo': {'N': '2'}, 'month': {'N': '1'}, 'anatomical_structures_breakdown': {'M': {'colon': {'N': '48'}, 'vagus nerve': {'N': '51'}, 'stomach': {'N': '36'}, 'heart': {'N': '40'}, 'urinary bladder': {'N': '16'}}}, 'year': {'N': '2023'}, 'sparc_datasets_cumulative': {'N': '173'}, 'new_sparc_maps_last_3_mo': {'N': '16'}, 'new_sparc_maps_last_1_mo': {'N': '0'}
  }
  
  const top5AnatomicalStructuresObject = sparcMetricsData['anatomical_structures_breakdown']['M']
  let top5AnatomicalStructuresArray = []
  // convert the response object into an object array of the form { 'name': <structure name>, 'value': <number of structures>}
  Object.keys(top5AnatomicalStructuresObject).forEach(key => top5AnatomicalStructuresArray.push({
    name: key,
    value: parseInt(top5AnatomicalStructuresObject[key]['N'])
  }))
  return {
    userBehaviors: {
      pageViewsLabels: ['All','Homepage', 'Find Data', 'Tools & Resources', 'Maps', 'News & Events'],
      pageViewsData: {
        lastMonth: [parseInt(ga4MetricsData['all_screen_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_home_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_find_data_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_tools_resources_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_maps_page_views_last_mo']['N']), parseInt(ga4MetricsData['all_news_events_page_views_last_mo']['N'])],
        last3Months: [parseInt(ga4MetricsData['all_screen_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_home_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_find_data_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_tools_resources_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_maps_page_views_last_quarter']['N']), parseInt(ga4MetricsData['all_news_events_page_views_last_quarter']['N'])]
      },
      usersData: {
        lastMonth: [parseInt(ga4MetricsData['returning_users_in_last_month']['N']), parseInt(ga4MetricsData['new_users_in_last_month']['N'])],
        last3Months: [parseInt(ga4MetricsData['returning_users_in_last_quarter']['N']), parseInt(ga4MetricsData['new_users_in_last_quarter']['N'])]
      },
      totalDownloadsData: {
        lastMonth: parseInt(pennsieveMetricsData['number_of_sparc_downloads_last_mo']['N']),
        last3Months: parseInt(pennsieveMetricsData['number_of_sparc_downloads_last_3_mo']['N'])
      },
      datasetContributorsData: {
        total: parseInt(pennsieveMetricsData['number_of_sparc_users_overall']['N']),
        newLastMonth: parseInt(pennsieveMetricsData['number_of_new_sparc_users_last_mo']['N'])
      },
    },
    scientificContribution: {
      dataChartLabels: ['All', 'Datasets', 'Anatomical Models', 'Computational Models'],
      dataChartData: {
        total: [parseInt(sparcMetricsData['all_sparc_categories_cumulative']['N']), parseInt(sparcMetricsData['sparc_datasets_cumulative']['N']), parseInt(sparcMetricsData['current_number_of_anatomical_structures']['N']), parseInt(sparcMetricsData['sparc_computational_models_cumulative']['N'])],
        lastMonth: [parseInt(sparcMetricsData['all_sparc_categories_last_mo']['N']), parseInt(sparcMetricsData['new_sparc_datasets_last_1_mo']['N']), parseInt(sparcMetricsData['current_number_of_anatomical_structures']['N']), parseInt(sparcMetricsData['new_sparc_computational_models_last_1_mo']['N'])],
        last3Months: [parseInt(sparcMetricsData['all_sparc_categories_last_3_mo']['N']), parseInt(sparcMetricsData['new_sparc_datasets_last_3_mo']['N']), parseInt(sparcMetricsData['current_number_of_anatomical_structures']['N']), parseInt(sparcMetricsData['new_sparc_computational_models_last_3_mo']['N'])]
      },
      samples: {
        total: parseInt(sparcMetricsData['number_of_samples_cumulative']['N']),
        newLastMonth: parseInt(sparcMetricsData['number_of_samples_last_mo']['N']),
        newLast3Months: parseInt(sparcMetricsData['number_of_samples_last_3_mo']['N']),
      },
      subjects: {
        total: parseInt(sparcMetricsData['number_of_subjects_cumulative']['N']),
        newLastMonth: parseInt(sparcMetricsData['number_of_subjects_last_month']['N']),
        newLast3Months: parseInt(sparcMetricsData['number_of_subjects_last_3_mo']['N']),
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
    Breadcrumb
  },

  async asyncData({ redirect, env }) {
    if (env.SHOW_METRICS == 'false') {
      redirect('/')
    }
    const metricsData = await fetchMetrics()
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
          to: {
            name: 'metrics',
            query: {
              metricsType: 'userBehaviors'
            }
          },
          label: 'Metrics'
        },
      ],
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
@import '../../assets/_variables.scss';

.page-data {
  background-color: #f5f7fa;
}
.search-tabs__container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: white;
  border: 0.1rem solid $purple-gray;
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
  outline: 0.1rem solid $median;
  @media (max-width: 40rem) {
    display: block;
  }
  li {
    width: 100%;
    text-align: center;
    color: $median;
  }
  li:last-child > a {
    border-right: none;
  }
}
.search-tabs__button {
  background: $light-purple;
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
    border-right: 0.1rem solid $median;
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
  &:focus,
  &.active {
    color: white;
    background-color: $median;
    font-weight: 500;
  }
}
.table-wrap {
  background: #fff;
  border: 1px solid rgb(228, 231, 237);
  padding: 16px;
  .search-error {
    margin: 0 0  auto;
    text-align:center;
  }
}
</style>
