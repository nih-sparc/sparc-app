<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ fields.title }}</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(fields.summary)" />
    </page-hero>
    <div class="container">
      <div class="page-description">
        <p v-html="fields.description" />
        <div class="page-description__button-container">
          <NuxtLink :to="'/data?type=sparcPartners'">
            <el-button>Browse Tools &amp; Resources</el-button>
          </NuxtLink>
        </div>
      </div>
      <div v-if="fields.featured !== undefined">
        <h2>Featured Tools &amp; Resources</h2>
        <div class="featured-resource-list">
          <featured-resource
            v-for="resource in fields.featured"
            :key="resource.sys.id"
            :title="resource.fields.name"
            :subtitle="resource.fields.resourceType.join(', ')"
            :tag="'SPARC'"
            :description="resource.fields.description"
            :thumbnailUrl="resource.fields.logo.fields.file.url"
            :buttonLink="`/resources/${resource.sys.id}`"
          />
        </div>
      </div>
      <div>
        <h2>Contribute</h2>
        <paper
          class="paper"
          :text="parseMarkdown(fields.paperText)"
          :button-text="'Submit a recommendation'"
          :button-link-external="'https://www.wrike.com/form/eyJhY2NvdW50SWQiOjMyMDM1ODgsInRhc2tGb3JtSWQiOjQ1Mjg4MX0JNDc3NjMzODM2NzUxMAk3MThkYTgzMDA5NTA4OGE1YmQ1YzdiZmQzY2YyZTA4MTQ4ZDQyNDhkYWFjZTU0OTMxN2U0ZmQ5MTAzYmY0MWRh'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
}
.container {
  & > div {
    margin: 3em 0;
  }
}
.page-description {
  color: rgb(36, 36, 91);
  & > p {
    font-size: 1.25em;
    line-height: 1.5rem;
    @media (min-width: 48em) {
      font-size: 1.25em;
      line-height: 2rem;
    }
  }
  &__button-container {
    text-align: center;
    & button {
      background-color: $median;
      width: auto;
      height: 40px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
      text-transform: uppercase;
      a {
        color: #fff;
      }
    }
  }
}
.featured-resource-list {
  & > div + div {
    margin-top: 2.5em;
  }
}
.paper {
  color: rgb(36, 36, 91);
}
</style>

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
