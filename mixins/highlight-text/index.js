import { defaultTo, head } from 'ramda'

export default {
  methods: {
    /**
     * Replaces matched search text with bolded version
     * @param {String} needle
     * @param {String} stack
     */
    highlightText: function(needle, stack) {
      if (!needle) {
        return stack || ''
      }
      const regex = new RegExp(needle, 'gi')
      const matched = stack.match(regex)
      if (matched && matched.length >= 1) {
        return stack.replace(regex, `<strong>${matched[0]}</strong>`)
      }
      return this.$sanitize(stack, ['strong'])
    }
  }
}
