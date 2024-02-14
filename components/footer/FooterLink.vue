<template>
  <a
    :href="linkUrl"
    :target="!opensInNewTab(linkUrl) && !isFeedbackLink ? '_self' : '_blank'"
  >
  {{ link.fields.title }}
  </a>
</template>

<script>
import { opensInNewTab } from '@/mixins/marked/index'

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
    opensInNewTab
  },

  computed: {
    currentUrl() {
      return encodeURIComponent(this.$nuxt.$route.fullPath)
    },
    isFeedbackLink() {
      const title = this.link.fields.title
      return title == 'Site Feedback'
    },
    linkUrl() {
      let url = this.link.fields.longUrl || this.link.fields.url
      if (this.isFeedbackLink) {
        url = url + `&source_url=${this.currentUrl}`
      }
      return url
    }
  }
}
</script>
