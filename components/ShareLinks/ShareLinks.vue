<template>
  <div class="share-links">
    <client-only>
      <share-network network="facebook" :url="pageUrl" :title="title">
        <sparc-tooltip
          placement="bottom-center"
          content="Share On Facebook"
        >
          <svg-icon slot="item" name="icon-share-facebook" class="remove-outline" height="2rem" width="1.75rem" />
        </sparc-tooltip>
      </share-network>
      <share-network network="twitter" :url="pageUrl" :title="title">
        <sparc-tooltip
          placement="bottom-center"
          content="Share On Twitter"
        >
          <svg-icon slot="item" name="icon-share-twitter" class="remove-outline" height="2rem" width="1.75rem" />
        </sparc-tooltip>
      </share-network>
      <share-network network="linkedin" :url="pageUrl" :title="title">
        <sparc-tooltip
          placement="bottom-center"
          content="Share On LinkedIn"
        >
          <svg-icon slot="item" name="icon-share-linked" class="remove-outline" height="2rem" width="1.75rem" />
        </sparc-tooltip>
      </share-network>
      <button class="btn-copy-permalink" @click="copyUrl">
        <sparc-tooltip
          placement="bottom-center"
          content="Copy Link"
        >
          <svg-icon slot="item" name="icon-permalink" height="2rem" width="1.75rem" />
        </sparc-tooltip>
      </button>
    </client-only>
  </div>
</template>

<script>
import { successMessage, failMessage } from '@/utils/notification-messages'

export default {
  name: 'ShareLinks',

  computed: {
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    }
  },

  props: {
    title: {
      type: String,
      default: ""
    }
  },

  methods: {
    /**
     * Copy file URL to clipboard
     * @param {Object} scope
     */
    copyUrl() {
      this.$copyText(this.pageUrl).then(
        () => {
          this.$message(successMessage(`URL copied to clipboard.`))
        },
        () => {
          this.$message(failMessage(`Cannot copy to clipboard.`))
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';

.btn-copy-permalink {
  border: none;
  background: none;
  color: $median;
  cursor: pointer;
  padding: 0;
  &:active {
    outline: none;
  }
}

.remove-outline {
  &:focus {
    outline: none;
  }
}
</style>
