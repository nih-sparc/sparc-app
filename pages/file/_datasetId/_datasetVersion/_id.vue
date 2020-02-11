<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <biolucida-viewer :data="biolucidaData" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import BiolucidaViewer from '@/components/BiolucidaViewer/BiolucidaViewer'

export default {
  name: 'FileDetailPage',

  components: {
    BiolucidaViewer
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
      }
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
