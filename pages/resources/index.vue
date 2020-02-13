<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h4>Resources</h4>
      <p>Ut ultrices fermentum null alacinia rhoncus. Donec dictum nisl turpis, non laoreet neque aliquet quis. Vivamus varius, urna a cursus tincidunt, erat lectus tincidunt dui, eu interdum arcu sapien.</p>
    </page-hero>
    <div class="page-wrap container">
      lorem ipsum
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'Resources',

  components: {
    Breadcrumb,
    PageHero
  },

  asyncData() {
    return Promise.all([
      client.getEntries({
        content_type: process.env.ctf_resource_id
      })
    ])
      .then(([resources]) => {
        return {
          resources: resources.items
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      resources: [],
      title: 'Resources',
      breadcrumb: {
        name: 'index',
        parent: 'Home'
      }
    }
  },

  methods: {
    resourceLogoUrl: function(resource) {
      return pathOr('', ['fields', 'logo', 'fields', 'file', 'url'], resource)
    },

    resourceLogoAlt: function(resource) {
      return pathOr('', ['fields', 'logo', 'fields', 'title'], resource)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.resources {
  .page-hero {
    background-image: none;
    background: $midnight;
    height: 211px;
    container {
      margin: 0;
    }
    p {
      font-size: 20px;
      font-weight: normal;
      line-height: 38px;
    }
  }
}
</style>
