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
          <span v-if="resource.fields.developedBySparc" class="mb-4 resource-category">
            SPARC
          </span>
          <span v-if="resource.fields.codeathon" class="mb-16 resource-category">
            Codeathon
          </span>
          <div class="label4">
            URL
          </div>
          <a class="resource-url truncated" :href="resource.fields.url" target="_blank">
            {{ resource.fields.url }}
          </a>
          <template v-if="resource.fields.owner">
            <div class="label4">
              Owner
            </div>
            <div class="truncated">
              {{ resource.fields.owner }}
            </div>
          </template>
          <template v-if="resource.fields.contactEmail">
            <div class="label4">
              Contact Email
            </div>
            <div class="truncated">
              {{ resource.fields.contactEmail }}
            </div>
          </template>
          <template v-if="resource.fields.fundingProgram">
            <div class="label4">
              Funding Program
            </div>
            <div class="truncated">
              {{ resource.fields.fundingProgram.fields.name }}
            </div>
          </template>
          <div class="mt-4 label4">
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

  head() {
    return {
      title: this.resource.fields.name,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.resource.fields.name,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.resource.fields.description ? this.resource.fields.description : 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        },
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
  margin-right: .25rem;
  font-size: 0.875rem;
  top: 10px;
  padding: 0.2rem 0.6rem;
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
