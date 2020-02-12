<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    @close="closeDialog"
  >
    <bf-dialog-header slot="title" title="Select from various organs and systems to filter your results:" />

    <dialog-body>
      <div class="flatmap__wrapper">
        <client-only placeholder="Loading viewer...">
          <FlatmapVuer
            entry="NCBITaxon:9606"
            height="100%"
            v-on:resource-selected="searchScaffoldLabel"
          />
        </client-only>
      </div>
    </dialog-body>

  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'
  import BfDialogHeader from '@/components/bf-dialog-header/BfDialogHeader.vue'
  import DialogBody from '@/components/dialog-body/DialogBody.vue'
  import '@abi-software/flatmapvuer'
  import '@abi-software/flatmapvuer/dist/flatmapvuer.css'

  interface Props {
    visible: boolean;
    onMapClick: (label: string) => void;
  }

  interface Methods {
    searchScaffoldLabel: (payload: { label: string }) => void
    closeDialog: () => void
  }

  export default Vue.extend<never, Methods, never, Props>({
    name: 'SearchMapPopup',

    components: { BfDialogHeader, DialogBody },

    props: {
      visible: {
        type: Boolean,
        default: false
      },
      onMapClick: {
        type: Function
      }
    },

    methods: {
      searchScaffoldLabel: function(this: Props & Methods, payload) {
        console.log(JSON.stringify(payload, undefined, 2))
        this.onMapClick(payload.label)
        this.closeDialog()
      },

      /**
       * Closes the dialog
       */
      closeDialog: function(this: { $emit: (message: string, value: boolean ) => void }) {
        this.$emit('update:visible', false)
      },
    }
  })
</script>

<style lang="scss" scoped>
  ::v-deep {
    .dialog-body,
    .el-dialog__body {
      font-size: inherit;
    }
    .el-dialog__body {
      overflow: hidden;
      overflow-y: auto;
    }
  }
  h2 {
    font-size: 0.875em;
    font-weight: 500;
    margin-bottom: 1em;
  }
  h3 {
    color: #000;
    font-size: 0.75em;
    font-weight: 500;
    line-height: 1;
    margin-bottom: 0.8125em;
  }
  ::v-deep .el-dialog {
    @media (max-width: 48em) {
      width: calc(100vw - 2em);
    }
  }
  .flatmap__wrapper {
    width:100%;
    height:512px
  }
</style>
