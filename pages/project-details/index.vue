<template>
  <div class="project-details">
    <div class="project-details__page-route">
      <p>Teams and Projects > Comprehensive structural and functional...</p>
    </div>
    <details-header>
      <img slot="banner image" src="http://placehold.jp/368x368.png" />
      <h3 slot="subtitle">
        {{ fields.organ.fields.name }}
      </h3>
      <h2 slot="title">
        {{ fields.title }}
      </h2>
      <p slot="description">
        {{ fields.description }}
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
    >
      <project-dataset-info v-show="activeTab === 'datasets'" />
      <project-team-info v-show="activeTab === 'teamInformation'" />
    </detail-tabs>
  </div>
</template>

<script>
import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import ProjectDatasetInfo from '@/components/ProjectDatasetInfo/ProjectDatasetInfo.vue'
import ProjectTeamInfo from '@/components/ProjectTeamInfo/ProjectTeamInfo.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'ProjectDetails',
  components: {
    DetailsHeader,
    DetailTabs,
    ProjectDatasetInfo,
    ProjectTeamInfo
  },

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_project_detail_id)
    ])
      .then(([page]) => {
        console.log('what is page ', page.fields)
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
        },
        {
          label: 'Team Information',
          type: 'teamInformation'
        }
      ],
      activeTab: 'datasets'
    }
  },

  methods: {
    setActiveTab: function(activeLabel) {
      this.activeTab = activeLabel
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
