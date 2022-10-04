<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ fields.title }}</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(fields.summary)" />
      <NuxtLink to="/resources/biological">
        <el-button class="secondary mb-16">Browse all Tools &amp; Resources</el-button>
      </NuxtLink>
    </page-hero>
    <div class="page-wrap container">
      <div v-if="fields.featured !== undefined">
        <div class="heading1 my-32">Featured Tools &amp; Resources</div>
        <resources-gallery
          :items="fields.featured"
        />
        <div class="link-container mt-16">
          <NuxtLink class="browse-all-link" to="/resources/biological">
            Browse All Tools &amp; Resources
          </NuxtLink>
        </div>
      </div>
      <div class="pb-16">
        <h2 class="heading2 mt-32">Contribute</h2>
        <paper
          :text="parseMarkdown(fields.paperText)"
          :button-text="'Submit a recommendation'"
          button-link="/resources/submit"
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
import Paper from '~/components/Paper/Paper.vue'
import ResourcesGallery from '~/components/ResourcesGallery/ResourcesGallery.vue'

const client = createClient()

export default {
  name: 'Resources',

  mixins: [marked],

  components: {
    Breadcrumb,
    PageHero,
    Paper,
    ResourcesGallery,
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
.browse-all-link {
  text-decoration: underline;
  font-weight: 500;
}
.link-container {
  text-align: center;
}
</style>
