<template>
  <div class="content-markdown">
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <!-- eslint-disable vue/no-v-html -->
            <!-- marked will sanitize the HTML injected -->
            <div v-html="parseMarkdown(copy)" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MarkedMixin from '@/mixins/marked'

export default Vue.extend<never, never, never, { copy: string }>({
  props: {
    copy: {
      type: String,
      default: ''
    }
  },

  name: 'ContentMarkdown',

  mixins: [MarkedMixin],
})
</script>