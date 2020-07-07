import marked from 'marked'

/**
 * Modify the link renderer to add `target="blank"`
 * https://github.com/markedjs/marked/pull/1371#issuecomment-434320596
 */
const renderer = new marked.Renderer()

renderer.link = function(href, title, text) {
  const link = marked.Renderer.prototype.link.apply(this, arguments)
  return link.replace('<a', "<a target='_blank'")
}

marked.setOptions({
  sanitize: true,
  renderer
})

export default {
  methods: {
    /**
     * Parse markdown
     * @param {String} markdown
     * @returns {HTML}
     */
    parseMarkdown: function(markdown = '') {
      return marked(markdown)
    }
  }
}
