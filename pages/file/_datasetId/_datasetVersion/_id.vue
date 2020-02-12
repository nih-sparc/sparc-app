<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <biolucida-viewer
          v-show="activeTab === 'viewer'"
          :data="biolucidaData"
        />
      </detail-tabs>
    </div>
  </div>
</template>

<script>
import BiolucidaViewer from '@/components/BiolucidaViewer/BiolucidaViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

export default {
  name: 'FileDetailPage',

  components: {
    BiolucidaViewer,
    DetailTabs
  },

  async asyncData({ route, $axios }) {
    const id = route.params.id
    const biolucidaData = await $axios.$get(
      `${process.env.BL_SERVER_URL}/imagemap/sharelink/${id}`
    )

    return { biolucidaData }
  },

  data: () => {
    return {
      biolucidaData: {
        biolucida_image_id: '',
        share_link: '',
        status: ''
      },
      tabs: [
        {
          label: 'Viewer',
          type: 'viewer'
        }
      ],
      activeTab: 'viewer'
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>
