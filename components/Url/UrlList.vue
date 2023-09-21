<template>
  <div>
    <url-input class="my-4" v-for="(val, index) in value"
      :disabled="disabled" v-model="value[index]"
      :placeholder="placeholder" @add-link="addLink" :showAddLink="index === value.length-1"
      :key="index"
    >
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
    value: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  watch: {
    value() {
      this.$emit("input", this.value)
    }
  },
  methods: {
    addLink() {
      this.$emit('add-link')
    }
  }
}
</script>
