export default {
  data() {
    return {
      hasError: false
    }
  },
  methods: {
    /**
     * Submit the form and validate
     */
    async onSubmit() {
      this.hasError = false
      this.$nuxt.$loading.start()
      await this.verifyRecaptcha()
      await this.$refs.submitForm.validate(async valid => {
        if (!valid) {
          this.$nuxt.$loading.finish()
          return
        }
        if (!this.hasError) {
          await this.sendForm()
        }
        this.$nuxt.$loading.finish()
        await this.$recaptcha.reset()
      })
    },

    async verifyRecaptcha() {
      try {
        const token = await this.$recaptcha.getResponse()
        const response = await this.$axios.$post(
          `/captcha-api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        ).then(() => {
          return true
        })
        return response
      } catch (error) {
        this.hasError = true;
        return
      }
    },
  }
}
