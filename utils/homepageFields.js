/**
 * Get homepage fields, but default to empty values
 * @param {Object} field
 * @returns {Object}
 */
export default (fields = {}) => {
  return {
    heroHeading: fields.heroHeading || '',
    heroCopy: fields.heroCopy || '',
    heroImage: fields.heroImage || {},
    featuredData: fields.featuredData || [],
    portalFeatures: fields.portalFeatures || [],
    featuredProject: fields.featuredProject || {},
    featuredDatasetId: fields.featuredDatasetId || '',
    title: fields.title || ''
  }
}
