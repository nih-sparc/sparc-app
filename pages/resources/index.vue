<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ fields.title }}</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(fields.summary)" />
      <NuxtLink to="/resources/databases">
        <el-button class="secondary mb-16">Browse all Tools &amp; Resources</el-button>
      </NuxtLink>
    </page-hero>
    <div class="page-wrap container">
      <div v-if="fields.featured !== undefined">
        <div class="heading2 my-32">Featured Tools &amp; Resources</div>
        <gallery
          galleryItemType="resources"
          :items="fields.featured"
        />
        <div class="link-container mt-16">
          <NuxtLink class="browse-all-link" to="/resources/databases">
            Browse All Tools &amp; Resources
          </NuxtLink>
        </div>
      </div>
      <div class="pb-16">
        <h2 class="heading2 mt-32">Contribute</h2>
        <paper
          :text="parseMarkdown(fields.paperText)"
          :button-text="'Submit a recommendation'"
          :button-link="{ name: 'contact-us', query: { type: 'tool'} }"
          new-tab
        />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'
import ErrorMessages from '@/mixins/error-messages'
import marked from '@/mixins/marked/index'
import Paper from '~/components/Paper/Paper.vue'
import Gallery from '~/components/Gallery/Gallery.vue'

const client = createClient()

export default {
  name: 'Resources',

  mixins: [marked],

  components: {
    Breadcrumb,
    PageHero,
    Paper,
    Gallery,
  },

  asyncData( { error } ) {
    // Get page content
    return client
      .getEntry(process.env.ctf_tools_and_resources_page_id)
      .then(({ fields }) => ({ fields }))
      .catch( e => {
        console.error(e)
        //Display the error page with an custom message
        error({ statusCode: 400, message: ErrorMessages.methods.contentful(), display: true, error: e} )
      })
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

  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.fields.summary ? this.fields.summary : 'The open community platform for bridging the body and the brain through neuroscience and systems physiology data, computational and spatial modeling, and device design.'
        },
      ]
    }
  }
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
