<template>
  <div class="resources">
    <tools-and-resources-page
      :page="resource"
      :content="resource.fields.longDescription"
      :breadcrumb="breadcrumb"
      :hero-title="resource.fields.name"
      :hero-summary="resource.fields.description"
      type="resource"
    >
    <div class="row">
      <div class="image-container mr-16 mb-16">
        <img v-if="resourceLogoUrl" class="resource-image" :src="resourceLogoUrl" :alt="resourceLogoAlt" />
      </div>
      <div class="truncated">
        <sparc-tooltip placement="bottom-center" :content="resource.fields.name" is-repeating-item-content>
          <div slot="item" class="heading1 truncated">
            {{ resource.fields.name }}
          </div>
        </sparc-tooltip>
        <span v-if="resource.fields.developedBySparc" class="mb-16 resource-category">
          SPARC
        </span>
        <div class="label4">
          URL
        </div>
        <a class="resource-url truncated" :href="resource.fields.url" target="_blank">
          {{ resource.fields.url }}
        </a>
        <div class="mt-16 label4">
          Share
        </div>
        <share-links class="mb-16"/>
      </div>
    </div> 
    </tools-and-resources-page>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import ToolsAndResourcesPage from '@/components/ToolAndResourcesPage/ToolsAndResourcesPage.vue'
import ShareLinks from '@/components/ShareLinks/ShareLinks'
import { searchTypes } from '@/pages/resources/utils'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'Resources',

  components: {
    ToolsAndResourcesPage,
    ShareLinks
  },

  async asyncData({ route }) {
    const resource = await client.getEntry(route.params.resourceId)
    const resourceType = pathOr('', ['fields', 'resourceType'], resource)[0]
    const parentPage = searchTypes.find(type => type.contentfulLabel == resourceType)
    return {
      resource,
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        },
        {
          label: 'Tools & Resources',
          to: {
            name: 'resources'
          }
        },
        {
          label: `${parentPage.label}`,
          to: {
            name: `resources-${parentPage.path}`
          }
        }
      ]
    }
  },

  computed: {
    /**
     * Compute the URL for the resource's logo
     * @returns {String}
     */
    resourceLogoUrl: function() {
      return pathOr(
        '',
        ['fields', 'logo', 'fields', 'file', 'url'],
        this.resource
      )
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

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.resources {
  background-color: $background;
  padding-bottom: 2rem;
}
.resource-category {
  background: $purple;
  border-radius: 15px;
  color: #fff;
  display: block;
  font-size: 0.875rem;
  top: 10px;
  padding: 0 0.65rem;
  right: 14px;
  width: fit-content;
}

.resource-url {
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: underline;
}
.resource-image {
  width: 100%;
  max-width: 20rem;
}
.row {
  display: flex;
  flex-flow: wrap;
  cursor: default;
}
.image-container {
  align-self: center;
}
.truncated {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
