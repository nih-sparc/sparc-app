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
