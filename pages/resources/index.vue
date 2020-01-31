<template>
  <div class="resources">
    <page-hero v-if="heroCopy" class="subpage">
      <p>
        {{ heroCopy }}
      </p>
    </page-hero>
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
import PageHero from '@/components/PageHero/PageHero.vue'

export default {
  name: 'Resources',

  components: {
    PageHero
  },

  data() {
    return {
      heroCopy: ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
