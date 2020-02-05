<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <biolucida-viewer />
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

  asyncData(ctx) {
    const id = ctx.route.params.id
    this.$axios
      .$get(`${process.env.BL_SERVER_URL}/image/${id}`)
      .then(response => {
        return {
          biolucidaData: response
        }
      })
  },

  data: () => {
    return {}
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
