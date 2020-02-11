<template>
  <div class="simulation-details">
    <details-header
      :subtitle="fields.subtitle"
      :title="fields.title"
      :description="fields.description"
      :breadcrumb="breadcrumb"
    >
      <img slot="banner image" src="http://placehold.jp/368x368.png" />
      <div slot="meta content" class="details-header__container--content-links">
        <div class="dataset-meta">
          <div class="simulation-updated-date">
            Last updated on {{ fields.lastUpdatedDate }}
          </div>
        </div>
        <div class="simulation-owners">
          <template>
            {{ fields.firstContributor }}
            <button class="contributors-button" href="#">
              <span class="button-text">...</span>
            </button>
            {{ fields.lastContributor }}
          </template>
          <!-- <template v-if="!isContributorListVisible">
            <contributor-item :contributor="firstContributor" />
            <button
              class="contributors-button"
              href="#"
              @click.prevent="isContributorListVisible = true"
            >
              <span class="button-text">...</span>
            </button>
          </template>

          <div
            v-for="(contributor, idx) in datasetContributorsList"
            :key="contributor.id"
            class="contributor-item-wrap"
          >
            <contributor-item :contributor="contributor" />
            <template v-if="idx < datasetContributorsList.length - 1">
              ,
            </template>
          </div> -->
        </div>
        <div class="header-stats-section">
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-files" height="20" width="20" />
            <div>
              <template v-if="fields.datasetFiles > 0">
                <strong>
                  {{ fields.simulationFiles }}
                </strong>
                Files
              </template>

              <template v-else>
                No Files
              </template>
            </div>
          </div>
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-storage" height="20" width="20" />
            <div>
              <strong>{{ fields.simulationStorage.number }}</strong>
              {{ fields.simulationStorage.unit }}
            </div>
          </div>
          <div class="header-stats-block">
            <svg-icon class="mr-8" name="icon-license" height="20" width="20" />
            <div>
              <template v-if="fields.datasetLicense">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="fields.datasetLicense.name"
                  placement="top"
                  :visible-arrow="false"
                >
                  <a :href="fields.simulationLicense.link" target="_blank">
                    {{ fields.datasetLicense.name }}
                  </a>
                </el-tooltip>
              </template>

              <template v-else>
                No License Selected
              </template>
            </div>
          </div>
        </div>
        <div class="simulation-links">
          <button class="simulation-button">
            <a href="#">Run Simulation</a>
          </button>
          <a href="#">Get Dataset</a>
          <a href="#">oSPARC Docs</a>
        </div>
      </div>
    </details-header>
    <detail-tabs
      :tabs="tabs"
      :active-tab="activeTab"
      class="container"
      @set-active-tab="setActiveTab"
    >
      <simulation-about-info v-show="activeTab === 'about'" />
    </detail-tabs>
  </div>
</template>

<script>
import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import SimulationAboutInfo from '@/components/SimulationDetails/SimulationAboutInfo.vue'

export default {
  name: 'SimulationDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    SimulationAboutInfo
  },

  data() {
    return {
      tabs: [
        {
          label: 'About',
          type: 'about'
        }
      ],
      activeTab: 'about',
      breadcrumb: {
        name: 'data',
        type: 'simulation',
        parent: 'Find Data'
      },
      fields: {
        // TODO remove later
        subtitle: 'Stomach',
        title: 'Multi-scale rabbit cardiac electrophysiology models',
        description:
          'A computational workflow for integration and implementation of a reusable and reproducible rabbit cardiac multi-scale electrophysiology model. Caption: Illustration of ion channels and action potential propogation in cardiac tissue.',
        lastUpdatedDate: 'October 17, 2019',
        firstContributor: 'Bartek Rajwa',
        lastContributor: 'Jin Chen',
        simulationFiles: '389',
        simulationStorage: {
          number: '1.1',
          unit: 'GB'
        },
        simulationLicense: {
          name: 'CC-BY-4.0',
          link: '#'
        }
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.simulation-details {
  .details-header {
    &__container {
      &--content-links {
        .contributors-button {
          height: 14px;
          width: 18px;
          border: 1px solid $median;
          border-radius: 2px;
          background-color: $light-purple;
          cursor: pointer;
          margin: 0 6px;
          padding: 0;

          &:focus {
            background-color: #b6b7ba;
          }

          .button-text {
            position: relative;
            bottom: 5px;
          }
        }
        .simulation-button {
          background-color: $median;
          width: 151px;
          height: 40px;
          font-size: 14px;
          color: #ffffff;
          font-weight: 500;
        }
        .simulation-links {
          a {
            text-decoration: none;
          }
        }

        .simulation-updated-date {
          line-height: 24px;
          color: black;
          font-size: 14px;
          line-height: 24px;

          a {
            color: #404554;
            text-decoration: underline;
            &:hover,
            &:active,
            &:visited {
              color: #404554;
            }
            &:focus {
              color: black;
            }
          }
        }
        .simulation-owners {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          color: #404554;
          font-size: 14px;
          line-height: 24px;
          margin-bottom: 40px;
          .contributor-item-wrap {
            display: inline-flex;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
