export default {
  methods: {
    notifySuccess: function(message) {
      this.$message({
        message: message,
        showClose: true,
        iconClass: 'el-icon-circle-check',
        customClass: 'el-message--success',
        duration: 5000
      })
    },
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
