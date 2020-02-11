<template>
  <div class="terms-of-service">
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <!-- eslint-disable vue/no-v-html -->
            <!-- marked will sanitize the HTML injected -->
            <div v-html="parseMarkdown(termsOfServiceCopy)" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import createClient from "@/plugins/contentful";
import MarkedMixin from '@/mixins/marked'

interface Data {
  termsOfServiceCopy: string
}

const client = createClient();
export default Vue.extend<Data, never, never, never>({
  name: 'TermsOfService',

  mixins: [MarkedMixin],

  async asyncData() {
    try {
      const { fields: { termsOfServiceCopy } } = await client.getEntry<Data>(process.env.ctf_terms_id as string)
      return { termsOfServiceCopy }
    } catch (e) {
      console.error(e)
      return { termsOfServiceCopy: '' }
    }
  }
})
</script>

<style lang="scss" scoped></style>
