<template>
  <el-dialog
    :show-close="false"
    :visible="open"
    @close="onClose"
    @opened="openedHandler"
    :before-close="beforeClose"
  >
    <bf-dialog-header slot="title" title="Select a viewer" />
    <dialog-body>
      <el-select v-model="selectedViewer" value-key="title" placeholder="Select a viewer...">
        <el-option
          v-for="viewer in viewersForFile"
          :key="viewer.title"
          :value="viewer"
          :label="viewer.title"
        >
        </el-option>
      </el-select>
      <bf-button @click="openFile" :disabled="selectedViewer === ''" :processing="isFetching">
        View in oSPARC
      </bf-button>
    </dialog-body>
  </el-dialog>
</template>

<script>
import { compose, split, last, defaultTo, pathOr } from "ramda"
import BfDialogHeader from "@/components/bf-dialog-header/BfDialogHeader.vue"
import DialogBody from "@/components/dialog-body/DialogBody.vue"
import BfButton from "@/components/shared/BfButton/BfButton.vue"
import { extractExtension } from "~/pages/data/utils"

export default {
  name: "OsparcFileViewersDialog",
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
      selectedViewer: "",
      isFetching: false
    }
  },
  methods: {
    openFile() {
      const fileSize = this.selectedFile.size
      const filePath = compose(
        last,
        defaultTo([]),
        split("s3://blackfynn-discover-use1/"),
        pathOr("", ["uri"])
      )(this.selectedFile)

      this.isFetching = true;

      this.$axios.$get(`${process.env.portal_api}/download?key=${filePath}`)
        .then(fileUrl => {
          const redirectionUrl = new URL(this.selectedViewer["view_url"])
    
          redirectionUrl.searchParams.append("download_link", fileUrl)
          redirectionUrl.searchParams.append("file_size", fileSize)

          window.open(redirectionUrl, "_blank")
    
          this.selectedViewer = ""
          this.onClose()
        })
        .finally(() => {
          this.isFetching = false;
        })
    },
    beforeClose(done) {
      this.selectedViewer = ""
      done()
    },
    openedHandler() {
      this.selectedViewer = this.viewersForFile[0]
    }
  }
}
</script>
