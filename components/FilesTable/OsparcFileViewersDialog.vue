<template>
  <el-dialog
    :show-close="false"
    :visible="open"
    @close="onClose"
  >
    <bf-dialog-header slot="title" title="Select a viewer" />
    <dialog-body>
      <el-select v-model="selectedViewer" placeholder="Select a viewer...">
        <el-option
          v-for="viewer in viewers"
          :key="viewer.name"
          :value="viewer.name"
          :label="viewer.name"
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

export default {
  name: 'OsparcFileViewersDialog',
  components: { BfButton, BfDialogHeader, DialogBody },
  props: {
    selectedFile: {
      type: Object
    },
    viewers: {
      type: Array
    },
    open: {
      type: Boolean
    },
    onClose: {
      type: Function
    }
  },
  data() {
    return {
      selectedViewer: ''
    }
  },
  methods: {
    openFile() {
      const fileType = this.selectedFile.fileType.toLowerCase()
      const fileSize = this.selectedFile.size
      const downloadLink = this.selectedFile.uri.toLowerCase()

      const redirectionUrl = new URL(process.env.osparc_host)

      redirectionUrl.searchParams.append('download_link', downloadLink);
      redirectionUrl.searchParams.append('file_size', fileSize);
      redirectionUrl.searchParams.append('file_type', fileType);

      window.open(redirectionUrl, '_blank')

      this.onClose()
    }
  }
}
</script>