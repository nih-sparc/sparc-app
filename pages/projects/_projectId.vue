<template>
  <div class="page">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <div class="page-wrap container">
      <div class="subpage">
        <div class="row">
          <el-col class="first-column mr-24">
            <div class="image-container p-16 mx-32 mb-32">
              <img
                class="image"
                :src="getImageSrc"
                :alt="getImageAlt"
              />
            </div>
            <hr />
            <div class="body1">
              <template v-if="projectSection">
                <div class="label4">
                  ANATOMICAL FOCUS
                </div>
                <div class="mb-16">
                  {{ projectSection }}
                </div>
              </template>
              <template v-if="investigator">
                <div class="label4">
                  PRINCIPAL INVESTIGATOR
                </div>
                <div class="mb-16">
                  {{ investigator }}
                </div>
              </template>
              <template v-if="institution">
                <div class="label4">
                  INSTITUTION
                </div>
                <div class="mb-16">
                  {{ institution }}
                </div>
              </template>
              <template v-if="awardId">
                <div class="label4">
                  NIH AWARD
                </div>
                <div class="mb-16">
                  <a :href="nihReporterUrl" target="_blank">
                    {{ awardId }}
                    <svg-icon v-if="!isInternalLink(nihReporterUrl)" name="icon-open" height="25" width="25" />
                  </a>
                </div>
              </template>
              <div class="label4">
                SHARE
              </div>
              <share-links class="share-links" />
            </div>
          </el-col>
          <el-col>
            <div class="heading2 mb-32">
              {{ title }}
            </div>
            <div class="body1">
              {{ description }}
            </div>
          </el-col>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import DatasetSearchResults from '@/components/SearchResults/DatasetSearchResults.vue'
import ShareLinks from '@/components/ShareLinks/ShareLinks.vue'
import { isInternalLink } from '@/mixins/marked/index'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'ProjectDetails',
  components: {
    Breadcrumb,
    DatasetSearchResults,
    ShareLinks
  },

  async asyncData({ route, $axios }) {
    try {
      const project = await client.getEntry(route.params.projectId)

      const datasets = await $axios
        .$get(`${process.env.portal_api}/projects/${project.fields.awardId}`)
        .catch(() => {
          return {}
        })

      return {
        fields: project.fields,
        datasets
      }
    } catch (e) {
      console.error(e)
    }
  },

  data() {
    return {
      datasets: {
        datasets: [],
        limit: 0,
        offset: 0,
        totalCount: 0
      },
      tabs: [
        {
          label: 'Datasets',
          type: 'datasets'
        }
      ],
      activeTab: 'datasets',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          to: {
            name: 'data',
            query: {
              type: 'sparcInfo',
              sparcInfoType: 'sparcAward'
            }
          },
          label: 'Find Data'
        }
      ]
    }
  },

  computed: {
    /**
     * Get image Source
     * @returns {String}
     */
    getImageSrc: function() {
      return this.fields.institution.fields.logo
        ? this.fields.institution.fields.logo.fields.file.url
        : ''
    },
    title: function() {
      return this.fields.title
    },
    description: function() {
      return this.fields.description
    },
    awardId: function() {
      return this.fields.awardId
    },
    institution: function() {
      return this.fields.institution.fields.name
    },
    investigator: function() {
      return this.fields.principleInvestigator
    },
    nihReporterUrl: function() {
      return this.fields.nihReporterUrl || '#'
    },
    /**
     * Get image source
     * @returns {String}
     */
    getImageAlt: function() {
      return this.fields.institution.fields.logo
        ? this.fields.institution.fields.logo.fields.file.description
        : ''
    },
    /**
     * Compute subtitle based on its project section
     * @returns {String}
     */
    projectSection: function() {
      return this.fields.projectSection
        ? this.fields.projectSection.fields.title
        : ''
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
    isInternalLink,
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.row {
  display: flex;
}
.first-column {
  max-width: 25rem;
}
.image-container {
  display: flex;
  aspect-ratio: 1;

border: 1px solid $lineColor2;}
.image {
  height: auto;
  width: 100%;
  margin: auto;
}
hr {
  border-top: none;
  border-left: none;
  border-right: none;
}
@media screen and (max-width: 760px) {
  .row {
    flex-direction: column;
  }
  .share-links {
    margin-bottom: 1rem;
  }
}
</style>
