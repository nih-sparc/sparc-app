export default {
  methods: {
    /**
     * Toast notification indicating success
     * @param {String} message
     */
    notifySuccess: function(message) {
      this.$message({
        message: message,
        showClose: true,
        iconClass: 'el-icon-circle-check',
        customClass: 'el-message--success',
        duration: 5000
      })
    },
    /**
     * Toast notification indicating failure
     * @param {String} message
     */
    notifyFail: function(message) {
      this.$message({
        message: message,
        showClose: true,
        iconClass: 'el-icon-circle-close',
        customClass: 'el-message--error',
        duration: 5000
      })
    }
  }
}
