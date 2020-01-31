<template>
  <div class="resources">
    <page-hero>
      <h2>{{ resource.fields.name }}</h2>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <div class="resource">
              <img :src="resourceLogoUrl" :alt="resourceLogoAlt" />
              <div class="resource__content">
                <p>
                  {{ resource.fields.description }}
                </p>
                <a :href="resource.fields.url" target="_blank">
                  <bf-button>
                    Visit Website
                  </bf-button>
                </a>
                </p>
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
import BfButton from '@/components/shared/BfButton/BfButton.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'Resources',

  components: {
    BfButton,
    PageHero
  },

  asyncData(ctx) {
    return Promise.all([client.getEntry(ctx.route.params.resourceId)])
      .then(([resource]) => {
        return {
          resource
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      resource: {}
    }
  },

  computed: {
    /**
     * Compute the URL for the resource's logo
     * @returns {String}
     */
    resourceLogoUrl: function() {
      return pathOr('', ['fields', 'logo', 'fields', 'file', 'url'], this.resource)
    },
    /**
     * Compute the alt tag for the resource's logo
     * @returns {String}
     */
    resourceLogoAlt: function() {
      return pathOr('', ['fields', 'logo', 'fields', 'title'], this.resource)
    }
  }
}
</script>

<style lang="scss" scoped></style>
