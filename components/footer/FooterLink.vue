<template>
  <a
    :href="linkUrl"
    :target="!opensInNewTab(linkUrl) ? '_self' : '_blank'"
  >
  {{ link.fields.title }}
  </a>
</template>

<script>
import { isInternalLink, opensInNewTab } from '@/mixins/marked/index'

export default {
  name: 'FooterLink',

  props: {
    link: {
      type: Object,
      default: () => {
        return {
          sys: {},
          fields: {}
        }
      }
    }
  },

  methods: {
    isInternalLink,
    opensInNewTab
  },

  computed: {
    currentUrl() {
      return encodeURIComponent(this.$nuxt.$route.fullPath)
    },
    linkUrl() {
      let url = this.link.fields.longUrl || this.link.fields.url
      const title = this.link.fields.title
      // Add users current location when reporting an issue so that we can capture url for site feedback
      if (title == 'Site Feedback') {
        url = url + `&source_url=${this.currentUrl}`
      }
      return url
    }
  }
}
</script>
