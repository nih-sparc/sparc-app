<template>
  <div>
    <url-input class="my-4" v-for="(link, index) in links" :disabled="disabled" :default-link="link" @link-updated="links[index] = $event" placeholder="Enter URL" @add-link="addLink" :showAddLink="index === links.length-1" :key="index">
      <template slot="prepend">Http://</template>
    </url-input>
  </div>
</template>

<script>

import UrlInput from '@/components/Url/UrlInput.vue'

export default {
  name: 'UrlList',
  components: {
    UrlInput
  },
  props: {
    defaultLinks: {
      type: Array,
      default: ['']
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      links: this.defaultLinks
    }
  },
  watch: {
    links(value) {
      this.$emit("links-updated", value)
    },
    defaultLinks(value) {
      this.links = value
    }
  },
  methods: {
    addLink() {
      this.$emit('add-link')
    },
  }
}
</script>
