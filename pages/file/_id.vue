<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24" />
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileDetailPage',

  asyncData() {},

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
