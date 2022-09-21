import createClient from '@/plugins/contentful.js'
import { searchQueryReplacements } from '@/pages/data/utils';

const client = createClient()

const replaceTerms = (terms?: String) => {
  let result = terms
  if (result) {
    Object.entries(searchQueryReplacements).forEach(([term, replacement]) => result = result?.replace(term, replacement))
  }
  return result
}
export const fetchResources = async (resourceType: String, terms?: String, sortOrder?: String, developedBySparc?: Boolean, limit?: Number, skip?: Number) => {
  const query = replaceTerms(terms)

  try {
    return await client.getEntries({
      content_type: process.env.ctf_resource_id,
      order: sortOrder || 'fields.name',
      query,
      limit,
      skip,
      'fields.resourceType[in]': resourceType,
      'fields.developedBySparc' : developedBySparc,
    }).then(async response => {
      return { ...response }
    })
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const searchTypes = [
  {
    label: 'Biological',
    path: 'biological',
    contentfulLabel: 'Biologicals'
  },
  {
    label: 'Databases',
    path: 'databases',
    contentfulLabel: 'Data and Models'
  },
  {
    label: 'Devices',
    path: 'devices',
    contentfulLabel: 'Devices'
  },
  {
    label: 'Information Services',
    path: 'information-services',
    contentfulLabel: 'Information Services'
  },
  {
    label: 'Software',
    path: 'software',
    contentfulLabel: 'Software'
  }
]

export const sortOptions = [
  {
    label: 'A-Z',
    id: 'alphabatical',
    sortOrder: 'fields.name'
  },
  {
    label: 'Z-A',
    id: 'reverseAlphabatical',
    sortOrder: '-fields.name'
  },
]