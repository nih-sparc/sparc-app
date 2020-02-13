<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    
    <div class="page-wrap container">
      lorem ipsum
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'Resources',

  components: {
    Breadcrumb
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
        name: 'resources',
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
.resource {
  img {
    display: block;
    height: auto;
    max-width: 300px;
  }
}
</style>
