<template>
  <div class="scaffold-viewer-page">
    <div class="page-wrap">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <client-only placeholder="Loading scaffold ...">
          <div class="scaffoldvuer-container">
            <ScaffoldVuer
              :url="scaffoldUrl"
              :scaffold-selected="scaffoldSelected"
              :traditional="true"
            />
          </div>
        </client-only>
      </detail-tabs>
    </div>
  </div>
</template>

<script>
import '@abi-software/scaffoldvuer'
import '@abi-software/scaffoldvuer/dist/scaffoldvuer.css'

import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

export default {
  name: 'ScaffoldViewerPage',

  components: {
    DetailTabs,
  },

  data: () => {
    return {
      tabs: [
        {
          label: 'Scaffold Viewer',
          type: 'scaffold',
        },
      ],
      activeTab: 'scaffold',
      file: {},
    }
  },

  computed: {
    scaffoldUrl: function() {
      console.log('coming here!!!!', this.$route.query.scaffold)
      console.log(
        'going to give url as',
        `${process.env.sparc_api_host}/s3-resource/${this.$route.query.scaffold}`,
      )
      return `${process.env.sparc_api_host}/s3-resource/${this.$route.query.scaffold}`
      // return this.$route.query.scaffold
    },
    /**
     * Compute biolucida data
     * @returns {Object}
     */
    biolucidaData: function() {
      return {
        biolucida_image_id: '',
        share_link: process.env.BL_SHARE_LINK_PREFIX + this.$route.query.viewer,
        status: '',
      }
    },
  },
  methods: {
    scaffoldSelected: function(data) {
      console.log(data)
    },
  },
}
</script>

<style scoped lang="scss">
.scaffoldvuer-container {
  margin-top: 1.5rem;
  height: 90vh;
  max-width: calc(100% - 48px);
  padding-left: 24px;
}

.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}

.about {
  text-align: center;
  min-height: 50vh;
  margin-top: 9rem;
}

h1 {
  flex: 1;
  font-size: 1.5em;
  line-height: 2rem;
}
.page-heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.375rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.page-heading__button {
  flex-shrink: 0;
}

.file-detail {
  border-bottom: 1px solid #dbdfe6;
  flex-direction: column;
  font-size: 0.875em;
  display: flex;
  padding: 1rem 0.625rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.file-detail__column {
  flex: 1;
}
</style>
