<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ fields.title }}</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(fields.summary)" />
    </page-hero>
    <div class="page-wrap container">
      <div class="mt-32">
        <p class="tab2" v-html="fields.description" />
        <div class="button-container">
          <NuxtLink :to="'/data?type=sparcPartners&developedBySparc=true&skip=0'">
            <el-button>Browse Tools &amp; Resources</el-button>
          </NuxtLink>
        </div>
      </div>
      <div v-if="fields.featured !== undefined">
        <h2 class="heading2 mt-32">Featured Tools &amp; Resources</h2>
        <div>
          <featured-resource
            class="mt-32"
            v-for="resource in fields.featured"
            :key="resource.sys.id"
            :title="resource.fields.name"
            :subtitle="resource.fields.resourceType.join(', ')"
            :tag="'SPARC'"
            :description="resource.fields.description"
            :thumbnail-url="resource.fields.logo.fields.file.url"
            :button-link="`/resources/${resource.sys.id}`"
            :external-url="resource.fields.url"
          />
        </div>
      </div>
      <div class="pb-16">
        <h2 class="heading2 mt-32">Contribute</h2>
        <paper
          :text="parseMarkdown(fields.paperText)"
          :button-text="'Submit a recommendation'"
          :button-link-external="'https://www.wrike.com/form/eyJhY2NvdW50SWQiOjMyMDM1ODgsInRhc2tGb3JtSWQiOjQ1Mjg4MX0JNDc3NjMzODM2NzUxMAk3MThkYTgzMDA5NTA4OGE1YmQ1YzdiZmQzY2YyZTA4MTQ4ZDQyNDhkYWFjZTU0OTMxN2U0ZmQ5MTAzYmY0MWRh'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'
import marked from '@/mixins/marked/index'
import FeaturedResource from '@/components/Resources/FeaturedResource.vue'
import Paper from '~/components/Paper/Paper.vue'

const client = createClient()

export default {
  name: 'Resources',

  mixins: [marked],

  components: {
    Breadcrumb,
    PageHero,
    FeaturedResource,
    Paper,
  },

  asyncData() {
    // Get page content
    return client
      .getEntry(process.env.ctf_tools_and_resources_page_id as string)
      .then(({ fields }) => ({ fields }))
      .catch(console.error)
  },

  data() {
    return {
      title: 'Tools & Resources',
      breadcrumb: [
        {
          to: {
            name: 'index',
          },
          label: 'Home',
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.resources {
  background-color: $background;
}
.button-container {
  text-align: center;
}
</style>
