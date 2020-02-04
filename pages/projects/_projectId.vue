<template>
  <div class="project-details">
    <details-header :data="fields" :breadcrumb="breadcrumb">
      <img slot="banner image" src="http://placehold.jp/368x368.png" />
      <h3 slot="subtitle">
        {{ fields.organ.fields.name }}
      </h3>
      <h2 slot="title">
        {{ formatTitle(fields.title) }}
      </h2>
      <p slot="description">
        {{ formatDescription(fields.description) }}
      </p>
      <div slot="meta content" class="details-header__container--content-meta">
        <div class="content-meta__item">
          <h3>Project Number</h3>
          <p>{{ fields.awardId }}</p>
        </div>
        <div class="content-meta__item">
          <h3>Project Leader</h3>
          <p>{{ fields.principleInvestigator }}</p>
        </div>
        <div class="content-meta__item">
          <h3>Institution</h3>
          <p>{{ fields.institution.fields.name }}</p>
        </div>
      </div>
      <div slot="meta content" class="details-header__container--content-links">
        <button>
          <a :href="fields.nihReporterUrl">View on NIH Website</a>
        </button>
      </div>
    </details-header>
    <detail-tabs
      :tabs="tabs"
      :active-tab="activeTab"
      @set-active-tab="setActiveTab"
      class="container"
    >
      <project-dataset-info v-show="activeTab === 'datasets'" />
    </detail-tabs>
  </div>
</template>

<script>
import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import ProjectDatasetInfo from '@/components/ProjectDatasetInfo/ProjectDatasetInfo.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'ProjectDetails',
  components: {
    DetailsHeader,
    DetailTabs,
    ProjectDatasetInfo
  },

  asyncData(ctx) {
    return Promise.all([
      // Get page content
      client.getEntry(ctx.route.params.projectId)
    ])
      .then(([page]) => {
        return {
          fields: page.fields
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      tabs: [
        {
          label: 'Datasets',
          type: 'datasets'
        }
      ],
      activeTab: 'datasets',
      breadcrumb: {
        name: 'data',
        type: 'sparcAward',
        parent: 'Teams and Projects'
      }
    }
  },

  methods: {
    /**
     * Sets active tab
     * @param {String} activeLabel
     */
    setActiveTab: function(activeLabel) {
      this.activeTab = activeLabel
    },

    /**
     * Formats description based on length
     * @param {String} description
     */
    formatDescription: function(description) {
      return description.length > 540
        ? description.substring(0, 540) + '...'
        : description
    },

    /**
     * Formats breadcrumb length
     * @param {String} breadcrumb
     */
    formatBreadcrumb: function(breadcrumb) {
      return breadcrumb.length > 32
        ? breadcrumb.substring(0, 32) + '...'
        : breadcrumb
    },

    /**
     * Formats title length
     * @param {String} title
     */
    formatTitle: function(title) {
      return title.length > 150 ? title.substring(0, 150) + '...' : title
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.project-details {
  &__page-route {
    background: $purple-gray;
    height: 2.5rem;
    margin-top: 0;
    p {
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      padding-left: 2rem;
      padding-top: 0.75rem;
      margin-top: 0;
      color: $midnight;
    }

    a {
      text-decoration: none;
      color: $midnight;
    }
  }
}
@media screen and (max-width: 768px) {
  .project-details {
    &__page-route {
      height: 3.5rem;
    }
  }
}
</style>
