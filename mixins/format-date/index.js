import { format, parseISO } from 'date-fns'

export default {
  methods: {
    /**
     * Format date for display
     * @param {Date} date
     * @returns {String}
     */
    formatDate: function(date) {
      return format(parseISO(date), 'MMMM d, yyyy')
    }
  }
}
