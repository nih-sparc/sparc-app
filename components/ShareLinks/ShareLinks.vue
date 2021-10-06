<template>
  <div class="share-links">
    <share-network network="facebook" :url="pageUrl" :title="title">
      <el-tooltip enterable effect="light" placement="top">
        <div slot="content">
          Share On Facebook
        </div>
        <svg-icon
          name="icon-share-facebook"
          class="remove-outline"
          height="28"
          width="28"
        />
      </el-tooltip>
    </share-network>
    <share-network network="twitter" :url="pageUrl" :title="title">
      <el-tooltip enterable effect="light" placement="top">
        <div slot="content">
          Share On Twitter
        </div>
        <svg-icon
          name="icon-share-twitter"
          class="remove-outline"
          height="28"
          width="28"
        />
      </el-tooltip>
    </share-network>
    <share-network network="linkedin" :url="pageUrl" :title="title">
      <el-tooltip enterable effect="light" placement="top">
        <div slot="content">
          Share On LinkedIn
        </div>
        <svg-icon
          name="icon-share-linked"
          class="remove-outline"
          height="28"
          width="28"
        />
      </el-tooltip>
    </share-network>
    <button class="btn-copy-permalink" @click="copyUrl">
      <el-tooltip enterable effect="light" placement="top">
        <div slot="content">
          Copy Link
        </div>
        <svg-icon name="icon-permalink" height="28" width="28" />
      </el-tooltip>
    </button>
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
