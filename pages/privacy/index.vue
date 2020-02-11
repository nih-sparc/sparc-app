<template>
  <div class="privacy-policy">
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <!-- eslint-disable vue/no-v-html -->
            <!-- marked will sanitize the HTML injected -->
            <div v-html="parseMarkdown(privacyPolicyCopy)" />
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
  privacyPolicyCopy: string
}

const client = createClient();

export default Vue.extend<Data, never, never, never>({
  name: 'PrivacyPolicy',

  mixins: [MarkedMixin],

  async asyncData() {
    try {
      const { fields: { privacyPolicyCopy } } = await client.getEntry<Data>(process.env.ctf_privacy_policy_id as string)
      return { privacyPolicyCopy }
    } catch (e) {
      console.error(e)
      return { privacyPolicyCopy: '' }
    }
  }
})
</script>

<style lang="scss" scoped></style>
