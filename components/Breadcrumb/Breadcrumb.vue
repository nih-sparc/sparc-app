<template>
  <div class="breadcrumb">
    <p>
      <nuxt-link
        :to="{
            name: breadcrumb.name,
            query: breadcrumb.type
              ? { type: breadcrumb.type }
              : []
          }"
      >
        {{ breadcrumb.parent }}
      </nuxt-link>
      > {{ formatTitle(title) }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface Breadcrumb {
  name: string,
  type: string,
  parent: string
}

interface Props {
  breadcrumb: Breadcrumb,
  title: string
}

interface Methods {
  formatTitle: (title: string) => string
}

export default Vue.extend<never, Methods, never, Props>({
  name: 'Breadcrumb',

  props: {
    breadcrumb: {
      type: Object,
      default: () => ({
        name: '',
        type: '',
        parent: '',
      })
    },
    title: {
      type: String,
      default: ''
    },
  },

  methods: {
    /**
     * Formats breadcrumb length
     * @param {String} breadcrumb
     */
    formatTitle: function(title) {
      return title.length > 32
        ? title.substring(0, 32) + '...'
        : title
    },
  }
})
</script>

<style lang="scss">
@import '../../assets/_variables.scss';
.breadcrumb {
  background: $purple-gray;
  height: 2.5rem;
  margin-top: 0;
  p {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    padding-left: 2rem;
    padding-top: 0.75rem;
    margin-top: 0;
    color: $midnight;
  }

  a {
    text-decoration: none;
    color: $midnight;
  }
}
</style>