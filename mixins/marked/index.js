import marked from 'marked'

/**
 * Modify the link renderer to add `target="blank"`
 * https://github.com/markedjs/marked/pull/1371#issuecomment-434320596
 */
const renderer = new marked.Renderer()
const linkRenderer = renderer.link
const tableRenderer = renderer.table

const isAnchor = str => {
  return /(?:^|\s)(#[^ ]+)/i.test(str)
}

const isInternalLink = str => {
  return isAnchor(str) ? true : str.includes(process.env.ROOT_URL)
}

renderer.link = function(href, title, text) {
  const html = linkRenderer.call(renderer, href, title, text)
  const isInternal = isInternalLink(href)

  return isInternal
    ? html
    : html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}

renderer.table = function(header, body) {
  const html = tableRenderer.call(renderer, header, body)

  return `<div class="markdown-table-wrap">${html}</div>`
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
