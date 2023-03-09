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
  /*
  const ga4MetricsData = await axios.get(`https://dev-metrics.sparc.science/ga4?year=${this.currentYear}&month=${this.currentMonth}`)//['body'][0]
  const pennsieveMetricsData = await axios.get(`https://dev-metrics.sparc.science/pennsieve?year=${this.currentYear}&month=${this.currentMonth}`)//['body'][0]
  const sparcMetricsData = await axios.get(`https://dev-metrics.sparc.science/sparc?year=${this.currentYear}&month=${this.currentMonth}`)//['body'][0]
  console.log("ga4MetricsData is ",ga4MetricsData)
  console.log("pennsieveMetricsData is ",pennsieveMetricsData)
  console.log("sparcMetricsData is ",sparcMetricsData)
  */
  const ga4MetricsData = {
  "year_month_source": {
    "S": "2023_02_ga4"
  },
  "source": {
    "S": "ga4"
  },
  "all_about_page_views_last_mo": {
    "N": "229"
  },
  "all_about_page_views_last_quarter": {
    "N": "456"
  },
  "all_find_data_page_views_last_mo": {
    "N": "7173"
  },
  "all_find_data_page_views_last_quarter": {
    "N": "12693"
  },
  "all_help_page_views_last_mo": {
    "N": "3"
  },
  "all_help_page_views_last_quarter": {
    "N": "9"
  },
  "all_home_page_views_last_mo": {
    "N": "12004"
  },
  "all_home_page_views_last_quarter": {
    "N": "22367"
  },
  "all_maps_page_views_last_mo": {
    "N": "467"
  },
  "all_maps_page_views_last_quarter": {
    "N": "890"
  },
  "all_news_events_page_views_last_mo": {
    "N": "633"
  },
  "all_news_events_page_views_last_quarter": {
    "N": "1460"
  },
  "all_screen_page_views_last_mo": {
    "N": "10405"
  },
  "all_screen_page_views_last_quarter": {
    "N": "19369"
  },
  "all_tools_resources_page_views_last_mo": {
    "N": "520"
  },
  "all_tools_resources_page_views_last_quarter": {
    "N": "1121"
  },
  "month": {
    "N": "2"
  },
  "new_users_in_last_month": {
    "N": "774"
  },
  "new_users_in_last_quarter": {
    "N": "1398"
  },
  "returning_users_in_last_month": {
    "N": "230"
  },
  "returning_users_in_last_quarter": {
    "N": "333"
  },
  "year": {
    "N": "356"
  }
}
  const pennsieveMetricsData = {
  "year_month_source": {
    "S": "2023_02_pennsieve"
  },
  "source": {
    "S": "pennsieve"
  },
  "month": {
    "N": "2"
  },
  "number_of_aws_downloads_last_3_mo": {
    "N": "0"
  },
  "number_of_aws_downloads_last_mo": {
    "N": "0"
  },
  "number_of_new_sparc_teams_last_3_mo": {
    "N": "0"
  },
  "number_of_new_sparc_teams_last_mo": {
    "N": "0"
  },
  "number_of_new_sparc_users_last_3_mo": {
    "N": "12"
  },
  "number_of_new_sparc_users_last_mo": {
    "N": "3"
  },
  "number_of_sparc_downloads_last_3_mo": {
    "N": "295"
  },
  "number_of_sparc_downloads_last_mo": {
    "N": "90"
  },
  "number_of_sparc_teams_overall": {
    "N": "62"
  },
  "number_of_sparc_users_overall": {
    "N": "516"
  },
  "total_number_gigabytes": {
    "N": "22951"
  },
  "year": {
    "N": "2023"
  }
}
  const sparcMetricsData = {
  "year_month_source": {
    "S": "2023_02_sparc"
  },
  "source": {
    "S": "sparc"
  },
  "all_sparc_categories_cumulative": {
    "N": "235"
  },
  "all_sparc_categories_last_3_mo": {
    "N": "21"
  },
  "all_sparc_categories_last_mo": {
    "N": "2"
  },
  "anatomical_structures_breakdown": {
    "M": {
      "colon": {
        "N": "48"
      },
      "heart": {
        "N": "40"
      },
      "stomach": {
        "N": "36"
      },
      "urinary bladder": {
        "N": "16"
      },
      "vagus nerve": {
        "N": "51"
      }
    }
  },
  "current_number_of_anatomical_structures": {
    "N": "43"
  },
  "embargoed_overall": {
    "N": "4"
  },
  "month": {
    "N": "2"
  },
  "new_sparc_computational_models_last_1_mo": {
    "N": "2"
  },
  "new_sparc_computational_models_last_3_mo": {
    "N": "5"
  },
  "new_sparc_datasets_last_1_mo": {
    "N": "0"
  },
  "new_sparc_datasets_last_3_mo": {
    "N": "0"
  },
  "new_sparc_maps_last_1_mo": {
    "N": "0"
  },
  "new_sparc_maps_last_3_mo": {
    "N": "16"
  },
  "number_of_samples_cumulative": {
    "N": "8065"
  },
  "number_of_samples_last_3_mo": {
    "N": "0"
  },
  "number_of_samples_last_mo": {
    "N": "0"
  },
  "number_of_subjects_cumulative": {
    "N": "2804"
  },
  "number_of_subjects_last_3_mo": {
    "N": "0"
  },
  "number_of_subjects_last_month": {
    "N": "0"
  },
  "sparc_computational_models_cumulative": {
    "N": "26"
  },
  "sparc_datasets_cumulative": {
    "N": "173"
  },
  "sparc_maps_cumulative": {
    "N": "36"
  },
  "year": {
    "N": "2023"
  }
}
  

  //USE FETCH INSTEAD OF AXIOS
    const today = new Date();
    //const currentMonth = (today.getMonth() +1).toString();
    const currentMonth = "2"
    const currentYear = today.getFullYear().toString();
    console.log(today)
    console.log(currentMonth)
    console.log(currentYear)

    
    const TESTga4MetricsData = await fetch(`https://dev-metrics.sparc.science/ga4?year=${currentYear}&month=${currentMonth}`)
    const TESTga4MetricsData2 = await TESTga4MetricsData.json();
    const TESTpennsieveMetricsData = await fetch(`https://dev-metrics.sparc.science/pennsieve?year=${currentYear}&month=${currentMonth}`)//['body'][0]
    const TESTpennsieveMetricsData2 =  await TESTpennsieveMetricsData.json();
    const TESTsparcMetricsData = await fetch(`https://dev-metrics.sparc.science/sparc?year=${currentYear}&month=${currentMonth}`)//['body'][0]
    const TESTsparcMetricsData2 = await TESTsparcMetricsData.json();
    console.log("ga4MetricsData is ",TESTga4MetricsData2)
    console.log("pennsieveMetricsData is ",TESTpennsieveMetricsData2)
    console.log("sparcMetricsData is ",TESTsparcMetricsData2)
    





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
        last3Months: parseInt(pennsieveMetricsData['number_of_sparc_downloads_last_3_mo']['N'])
      },
      datasetContributorsData: {
        total: parseInt(pennsieveMetricsData['number_of_sparc_users_overall']['N']),
        newLastMonth: parseInt(pennsieveMetricsData['number_of_new_sparc_users_last_mo']['N'])
      },
    },
    scientificContribution: {
      dataChartLabels: ['All', 'Datasets', 'Anatomical Models', 'Computational Models', 'Embargoed (across all)'],
      dataChartData: {
        total: [parseInt(sparcMetricsData['all_sparc_categories_cumulative']['N']), parseInt(sparcMetricsData['sparc_datasets_cumulative']['N']), parseInt(sparcMetricsData['current_number_of_anatomical_structures']['N']), parseInt(sparcMetricsData['sparc_computational_models_cumulative']['N']), parseInt(sparcMetricsData['embargoed_overall']['N'])],
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
      //currentMonth: '',
      //currentYear: '',
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
    //const {currentMonth, currentYear} = getCurrentMonthAndYear();
    if (!this.$route.query.metricsType) {
      const firstTabType = compose(propOr('', 'type'), head)(metricsTypes)
      this.$router.replace({ query: { metricsType: firstTabType } })
    }
  },

  methods: {
    getCurrentMonthAndYear: function() {
      const today = new Date();
      const month = (today.getMonth() +1).toString();
      const year = today.getFullYear().toString();
      return { currentMonth: month, currentYear: year };
    }
  }

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
