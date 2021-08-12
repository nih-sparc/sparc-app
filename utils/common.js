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

/**
 * Extract a section from a snippet of html.
 * @param {String} section  The name of the section to extract.
 * @param {*} html_in The html to extract the section from.
 * @returns The extracted html section as a string, an empty string if no section is extracted.
 */
export const extractSection = (section, html_in) => {
  const doc = new DOMParser().parseFromString(html_in, 'text/html')
  const links = doc.querySelectorAll('p')
  let html_section = ''
  links.forEach(paragraph => {
    if (paragraph.innerText.includes(section)) {
      html_section = paragraph.innerText.replace(section, '')
    }
  })
  return html_section
}
