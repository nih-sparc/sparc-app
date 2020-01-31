<template>
  <div class="resources">
    <page-hero>
      <h2>Resources</h2>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <div
              v-for="resource in resources"
              :key="resource.sys.id"
              class="resource"
            >
              <img
                :src="resourceLogoUrl(resource)"
                :alt="resourceLogoAlt(resource)"
              />
              <div class="resource__content">
                <h2>
                  <nuxt-link
                    :to="{
                      name: 'resources-resourceId',
                      params: { resourceId: resource.sys.id }
                    }"
                  >
                    {{ resource.fields.name }}
                  </nuxt-link>
                </h2>
                <div>{{ resource.fields.description }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'Resources',

  components: {
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
      resources: []
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
