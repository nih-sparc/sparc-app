import ErrorMessages from '@/mixins/error-messages'
import { failMessage } from '@/utils/notification-messages'

export default {
  watch: {
    contentfulError: {
      handler(value) {
        if (value)
          this.$message(failMessage(ErrorMessages.methods.contentful()))
      },
      immediate: true
    }
  },
  data: () => {
    return {
      contentfulError: false
    }
  }
}
