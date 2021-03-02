<template>
  <el-dialog
    :show-close="false"
    :visible="open"
    @close="onClose"
    :before-close="beforeClose"
  >
    <bf-dialog-header slot="title" title="Select a viewer" />
    <dialog-body>
      <el-select v-model="selectedViewer" placeholder="Select a viewer...">
        <el-option
          v-for="viewer in viewersForFile"
          :key="viewer.title"
          :value="viewer"
          :label="viewer.title"
        >
        </el-option>
      </el-select>
      <bf-button @click="openFile" :disabled="selectedViewer === ''">
        View in oSPARC
      </bf-button>
    </dialog-body>
  </el-dialog>
</template>

<script>
import BfDialogHeader from '@/components/bf-dialog-header/BfDialogHeader.vue'
import DialogBody from '@/components/dialog-body/DialogBody.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'
import { extractExtension } from '~/pages/data/utils'

export default {
  name: 'OsparcFileViewersDialog',
  components: { BfButton, BfDialogHeader, DialogBody },
  props: {
    selectedFile: {
      type: Object
    },
    viewers: {
      type: Object
    },
    open: {
      type: Boolean
    },
    onClose: {
      type: Function
    }
  },
  computed: {
    viewersForFile: function() {
      if (this.selectedFile && this.viewers) {
        return this.viewers[this.fileExtension]
      }
      return []
    },
    fileExtension: function() {
      return extractExtension(this.selectedFile.path)
    }
  },
  data() {
    return {
      selectedViewer: ''
    }
  },
  methods: {
    openFile() {
      const fileSize = this.selectedFile.size
      const downloadLink = this.selectedFile.uri.toLowerCase()

      const redirectionUrl = new URL(this.selectedViewer['view_url'])

      redirectionUrl.searchParams.append('download_link', downloadLink);
      redirectionUrl.searchParams.append('file_size', fileSize);

      window.open(redirectionUrl, '_blank')

      this.selectedViewer = ''
      this.onClose()
    },
    beforeClose(done) {
      this.selectedViewer = ''
      done()
    }
  }
}
</script>