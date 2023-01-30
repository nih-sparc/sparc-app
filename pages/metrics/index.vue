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

export default {
  name: 'MetricsPage',

  components: {
    Breadcrumb
  },

  async asyncData({ redirect, env }) {
    if (env.SHOW_METRICS == 'false') {
      redirect('/')
    }
  },

  data: () => {
    return {
      metricsTypes,
      metricsData: {},
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
              metricsType: 'userBehavior'
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

  watch: {
    '$route.query.metricsType': function(val) {
      if (!this.$route.query.metricsType) {
        const firstTabType = compose(propOr('', 'type'), head)(metricsTypes)
        this.$router.replace({ query: { metricsType: firstTabType } })
      } else {
        this.fetchMetrics()
      }
    }
  },

  /**
   * Check the metricsType param in the route and set it if it 
   */
  mounted: function() {
    if (!this.$route.query.metricsType) {
      const firstTabType = compose(propOr('', 'type'), head)(metricsTypes)
      this.$router.replace({ query: { metricsType: firstTabType } })
    } else {
      this.fetchMetrics()
    }
  },

  methods: {
    /**
     * Figure out which source to fetch results from based on the
     * type of search
     */
    fetchMetrics: function() {
      this.metricsData = {
        userBehaviors: {
          pageViews: [
            {
              title: 'Homepage',
              views: 237
            },
            {
              title: 'Find Data',
              views: 162
            },
            {
              title: 'Tools & Resources',
              views: 99
            },
            {
              title: 'Maps',
              views: 147
            },
            {
              title: 'News & Events',
              views: 133
            },
            {
              title: 'About',
              views: 101
            }
          ],
          userTypes: {
            returningUser: 460,
            newUser: 324
          },
          totalDownloads: 1375,
          datasetContributors: 123
        },
        scientificContribution: {
          fileStorage: 642
        }
      }
      /*const source = propOr('google', 'dataSource', this.searchType)

      const metricsSources = {
        google: this.fetchFromGoogleAnalytics,
      }

      if (typeof metricsSources[source] === 'function') {
        this.$nextTick(() => metricsSources[source]())
      }*/
    },

    /**
     * Get Search results
     * This is using fetch from the Algolia API
     */
    fetchFromGoogleAnalytics: function() {
      this.isLoadingMetrics = true
      this.searchFailed = false
    },
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
