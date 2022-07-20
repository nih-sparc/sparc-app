export default {
  data() {
    return {
      hasError: false,
      isSubmitting: false,
      memberInfo: {}
    }
  },

  methods: {
    /**
     * Subscribe to Newsletter
     */
    subscribeToNewsletter(email, firstName, lastName) {
      this.isSubmitting = true

      this.$axios
        .post(`${process.env.portal_api}/mailchimp_subscribe`, {
          email_address: email,
          first_name: firstName,
          last_name: lastName
        })
        .then(response => {
          const { title } = response.data
          if (response.data.status > 200 && title !== 'Member Exists') {
            this.hasError = true
          } else {
            this.memberInfo = response.data
            this.$emit('submit', firstName)
          }
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    unsubscribeFromNewsletter(email) {
      this.isSubmitting = true

      this.$axios
        .post(`${process.env.portal_api}/mailchimp_unsubscribe`, {
          email_address: email,
        })
        .then(response => {
          if (response.data.status > 200) {
            this.hasError = true
          } else {
            this.memberInfo = response.data
          }
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    getMemberInfo(email) {
      this.isSubmitting = true
      this.$axios
        .get(`${process.env.portal_api}/mailchimp_member_info/${email}`)
        .then(response => {
          if (response.data.status > 200) {
            this.hasError = true
          } else {
            this.memberInfo = response.data
          }
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    /**
     * Validate name
     * @param {Object} rule
     * @param {String} value
     * @param {Function} callback
     */
    validateForNewsletter: function(rule, value, callback) {
      if (this.form.shouldSubscribe && value === '') {
        callback(new Error(rule.message))
      }
      callback()
    }
  }
}
