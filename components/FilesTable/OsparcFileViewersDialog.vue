<template>
  <el-dialog
    :show-close="false"
    :visible="open"
    @close="onClose"
  >
    <bf-dialog-header slot="title" title="Select a viewer" />
    <dialog-body>
      <template>
        Text in dialog
      </template>
    </dialog-body>
    <div slot="footer" class="dialog-footer">
      <bf-button>
        View in oSPARC
      </bf-button>
    </div>
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
    viewers: {
      type: Array
    },
    open: {
      type: Boolean
    },
    onClose: {
      type: Function
    }
  }  
}
</script>