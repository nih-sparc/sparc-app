/**
 * Get the file name from a path.
 *
 * @param {*} str
 * @returns
 */
export const baseName = str => {
  return str
    .split('\\')
    .pop()
    .split('/')
    .pop()
}

// Convert a string to XML Node Structure.
// Returns null on failure.
function textToHTML(text) {
  try {
    let xml = null

    if (window.DOMParser) {
      const parser = new DOMParser()
      xml = parser.parseFromString(text, 'text/html')

      const found = xml.getElementsByTagName('parsererror')

      if (!found || !found.length || !found[0].childNodes.length) {
        return xml
      }

      return null
    } else {
      xml = new ActiveXObject('Microsoft.XMLDOM')

      xml.async = false
      xml.loadXML(text)

      return xml
    }
  } catch (e) {
    // suppress
  }
}

/**
 * Extract a section from a snippet of html.
 * @param {String} section  The name of the section to extract.
 * @param {*} html_in The html to extract the section from.
 * @returns The extracted html section as a string, an empty string if no section is extracted.
 */
export const extractSection = (section, html_in) => {
  const doc = textToHTML(html_in)
  const links = doc.querySelectorAll('p')
  let html_section = ''
  links.forEach(paragraph => {
    if (paragraph.innerText.includes(section)) {
      html_section = paragraph.innerText.replace(section, '')
    }
  })
  return html_section
}
