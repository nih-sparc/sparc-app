<template>
  <large-modal
    v-if="modalVisible"
    :visible="modalVisible"
    @close-download-dialog="modalVisible = false"
  >
    <div slot="mainContent">
      <h2>Confirmation required</h2>
      <slot name="confirmation-body"/>
      <div class="buttons-container">
        <span><el-button class="secondary" @click="confirmationCancelled">Cancel</el-button></span>
        <span><el-button class="danger" @click="confirmationAccepted">Remove</el-button></span>
      </div>
    </div>
  </large-modal>
</template>

<script>
export default {
  name: 'ConfirmationModal',

  data: function() {
    return {
      modalVisible: false,
      form: {
        detailedDescription: '',
        shortDescription: '',
      },
      isSubmitting: false,
    }
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showModal: {
      handler: function(show) {
        if (show) {
          this.modalVisible = true
        } else {
          this.modalVisible = false
        }
      }
    },
    modalVisible: {
      handler: function(show) {
        if (!show) {
          this.$emit('modal-closed')
        }
      }
    },
  },
  methods: {
    confirmationAccepted() {
      this.$emit('confirmed', true)
    },
    confirmationCancelled() {
      this.$emit('cancelled', true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.buttons-container {
  text-align: right;
}
</style>
