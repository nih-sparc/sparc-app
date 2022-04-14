<template>
  <bf-button @click="copyDownloadLink(file)">
    Copy download link
  </bf-button>
</template>

<script>
import { compose, last, defaultTo, split } from 'ramda'
import BfButton from '@/components/shared/BfButton/BfButton.vue'
import { successMessage, failMessage } from '@/utils/notification-messages'

export default {
  name: 'DownloadLinkButton',
  components: {
    BfButton
  },
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    copyDownloadLink(file) {
      const { uri } = file
      const fileKey = compose(
        last,
        defaultTo([]),
        split('s3://pennsieve-prod-discover-publish-use1/')
      )(uri)
      const downloadUrl = new URL('download', process.env.portal_api)
      downloadUrl.searchParams.append('key', fileKey)
      this.$copyText(downloadUrl.toString())
        .then(() => {
          this.$message(successMessage('Download link copied to clipboard.'))
        })
        .catch(() => {
          this.$message(failMessage('Failed to copy download link.'))
        })
    }
  }
}
</script>
