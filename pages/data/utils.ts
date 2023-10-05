import { Entry } from "contentful";
import {ExtendedVue, Vue, VueConfiguration, VueConstructor} from "vue/types/vue";
import { SearchIndex } from "algoliasearch";

interface Tag {
  name: string;
  slug: string
}

/**
 *
 * this utility type is provided by contentful, and demonstrates basic generics:
 *
 * export interface Entry<T> {
 *   sys: Sys;
 *   fields: T;
 *   toPlainObject(): object;
 *   update(): Promise<Entry<T>>;
 * }
 *
 * in english: "take the type argument: T, and make that the fields key in the object"
 *
 * the result:
 * {
 *   sys: Sys;
 *   fields: Tag
 * }
 */
type TagEntry = Entry<Tag>

interface Filter {
  category: string
  tags?: TagEntry[]
}

interface TransformedInnerFilter {
  label: string;
  category: string;
  key: string
  value: boolean;
}

type TransformedFilter = Filter & {
  filters: TransformedInnerFilter[]
}

/**
 * this is the type signature for the function below.  It takes a Filter, and returns a TransformedFilter
 */
type FilterTransform = (filter: Filter) => TransformedFilter

/**
 * since you know the shape of the thing you are dealing with, and the shape of the thing you want to return,
 * you end up with a function that is much easier to read and understand, IMHO
 */
export const transformIndividualFilter: FilterTransform = outerFilter => ({
  ...outerFilter,
  filters: (outerFilter.tags ?? []).map(t => ({
    label: t.fields.name,
    category: outerFilter.category,
    key: t.fields.slug,
    value: false
  }))
})


interface OuterFilter {
  type: string;
  filters?: Entry<Filter>[]
}

/**
 * here we see the generics at work again.  We're able to concisely express
 * the complicated nesting of { sys, fields } objects that occurs when we
 * model things in contentful
 */
type FilterResponse = Entry<OuterFilter>

type TransformFilters = (fields: FilterResponse['fields']) => TransformedFilter[]

/**
 * and now the function is much more readable
 * the type system made it immediately apparent that the original function's 'flatten' operation
 * was actually an unnecessary no-op
 */
export const transformFilters: TransformFilters = fields =>
  (fields.filters ?? [])
    .map(f => transformIndividualFilter(f.fields))

/**
 * common function to bubble the search change event from a component containing an el-table to a parent component
 */
export const onSortChange = (instance: Vue<{}>, payload: SortChangeEvent): void => {
  instance.$emit('sort-change', payload)
}

interface SearchData {
  limit: number;
  skip: number;
  items: unknown[];
  order?: string
  ascending: boolean;
}

interface SortChangeEvent {
  column: unknown;
  prop: string;
  order: 'ascending' | 'descending' | null
}

/**
 * mutates the searchData parameter according to the payload parameter
 * calls the passed fetchResults function to get new, sorted results
 * @param dataSource indicates which API we are using
 * @param searchData gets mutated based on payload
 * @param fetchResults called once searchData is updated
 * @param payload the sort event
 */
export const handleSortChange = (
  dataSource: 'contentful' | 'blackfynn',
  searchData: SearchData,
  fetchResults: () => void,
  payload: SortChangeEvent
): void => {
  searchData.skip = 0
  if (dataSource === 'blackfynn') {
    searchData.order = payload.order === null || payload.prop === 'createdAt'
      ? 'date'
      : payload.prop
    searchData.ascending = payload.order === 'ascending'
  } else {
    searchData.order = payload.order === null
      ? undefined
      : `${payload.order === 'descending' ? '-' : ''}${payload.prop}`
  }

  fetchResults()
}

/**
 * Gets the file extension for a file or path
 * @param path Path or filename
 * @returns String containing the file extension
 */
export const extractExtension = (
  path : string
): string => {
  const split = path.split('.')
  if (split.length > 1) {
    const ext = split.pop()
    return ext || ''
  }
  return ''
}

// Mapping between display categories and their Algolia index property path
// Used for populating the Dataset Search Results facet menu dynamically
export const facetPropPathMapping = [
  {
    label: 'Type',
    id: 'item.types',
    facetPropPath: 'item.types.name',
    facetSubpropPath: 'item.types.subcategory.name'
  },
  {
    label: 'Anatomical Structure',
    id: 'anatomy.organ.category',
    facetPropPath: 'anatomy.organ.category.name',
    facetSubpropPath: 'anatomy.organ.subcategory.name'
  },
  // This cannot be removed until the maps sidebar implements heirarchal facets. So in the meantime we simply don't make this category visible on the facet menu
  {
    label: 'Anatomical Structure',
    id: 'anatomy.organ',
    facetPropPath: 'anatomy.organ.name',
    facetSubpropPath: 'anatomy.organ.subcategory.name'
  },
  {
    label: 'Species',
    id: 'organisms.primary.species',
    facetPropPath: 'organisms.primary.species.name',
    facetSubpropPath: 'organisms.primary.species.subcategory.name'
  },
  {
    label: 'Experimental Approach',
    id: 'item.modalities',
    facetPropPath: 'item.modalities.keyword',
    facetSubpropPath: 'item.modalities.subcategory.name'
  },
  {
    label: 'Sex',
    id: 'attributes.subject.sex',
    facetPropPath: 'attributes.subject.sex.value',
    facetSubpropPath: 'attributes.subject.sex.subcategory.name'
  },
  {
    label: 'Age Categories',
    id: 'attributes.subject.ageCategory',
    facetPropPath: 'attributes.subject.ageCategory.value',
    facetSubpropPath: 'attributes.subject.ageCategory.subcategory.name'
  },
]

export const getAlgoliaFacets = function(algoliaIndex : SearchIndex, propPathMapping : Array<{id: string, facetPropPath: string, facetSubpropPath: string, label: string}>, filters : string) {
  const facetPropPaths = propPathMapping.map(item => item.facetPropPath)
  const facetSubpropPaths = propPathMapping.map(item => item.facetSubpropPath)
  var facetData: { label: String, id: number, children: object[], key: string }[] = []
  var facetId = 0
  return algoliaIndex
    .search('', {
      sortFacetValuesBy: 'alpha',
      facets: facetPropPaths.concat(facetSubpropPaths),
      filters: filters || ''
    })
    .then(response => {
      facetPropPaths.map((facetPropPath: string) => {
        const parentFacet = propPathMapping.find(item => item.facetPropPath == facetPropPath)
        var children: { label: string, id: number, children: Object, facetPropPath: string }[] = []
        const responseFacets = response.facets
        if (responseFacets === undefined) {return}
        const responseFacetChildren =
          responseFacets[facetPropPath] == undefined
            ? {}
            : responseFacets[facetPropPath]
        const allPossibleChildrenSubfacets = parentFacet && responseFacets[parentFacet.facetSubpropPath] ? Object.keys(responseFacets[parentFacet.facetSubpropPath]) : []
        Object.keys(responseFacetChildren).map(facet => {
          const childrenSubfacets = allPossibleChildrenSubfacets.reduce((filtered, childFacetInfo) => {
            const info = childFacetInfo.split('.')
            if (info.length != 2) {
              return filtered
            }
            if (facet == info[0]) {
              filtered.push({
                label: childFacetInfo, 
                id: facetId++,
                facetPropPath: `${parentFacet?.facetSubpropPath}`
              })
            }
           return filtered;
          }
          , Array<{label: string, id: number, facetPropPath: string}>())
          children.push({
            label: facet,
            id: facetId++,
            children: childrenSubfacets,
            facetPropPath: facetPropPath
          })
        })
        if (children.length > 0) {
          facetData.push({
            label: parentFacet?.label || '',
            id: facetId++,
            children: children,
            key: facetPropPath
          })
        }
      })
      return facetData
    }).catch(() => {
      return {}
    })
}

export const searchQueryReplacements: { [orig: string]: string } = {
  'o2s2parc': 'o\u00b2s\u00b2parc',
  'osparc': 'o\u00b2s\u00b2parc'
}

export const HIGHLIGHT_HTML_TAG = 'b'
/**
 * Function that takes a text and search input and wraps matching substrings with the given HTML tag.
 * @param {String} text Input text to be processed
 * @param {String} search Search terms
 * @returns {String} Output text with matching terms wrapped by given HTML tag. Original text if search is empty.
 */
export const highlightMatches = (text: string, search: string): string => {
  if (text && search) {
    const terms = search.split(' ')
    let result = text
    terms.forEach(t => {
      const trimmed = t.replace(/^"|"$/, '') // Trims out double quotes that could be used in searching
      result = result.replace(new RegExp(trimmed, 'ig'), `<${HIGHLIGHT_HTML_TAG}>$&</${HIGHLIGHT_HTML_TAG}>`)
    })
    return result
  }
  return text
}

export const saveForm = (payload: any): void => {
  const { user, ...rest } = payload
  saveJsonToSessionStorage(user, 'userDataForm')
}

export const loadForm = (): any => {
  const user = loadJsonFromSessionStorage('userDataForm')
  if (user == null) {
    return null
  }
  return {
    user
  }
}

export const saveJsonToSessionStorage = (payload: any, storageKey: string): void => {
  try {
    const json = JSON.stringify(payload)
    sessionStorage.setItem(storageKey, json)
  }
  catch {
    console.error('Could not serialize object to JSON for storing it')
  }
}

export const loadJsonFromSessionStorage = (storageKey: string): any => {
  const json = sessionStorage.getItem(storageKey)
  if (json) {
    try {
      return JSON.parse(json)
    }
    catch {
      console.error('Could not deserialize stored form to a JS object')
    }
  }
}

/**
 * Function used in contact form templates to populate the form with the user info
 * coming from its login profile.
 * @param form Form data to populate
 * @param firstName First name of the user as found in log in info
 * @param lastName Last Name of the user as found in log in info
 * @param email Email of the user as found in log in info
 */
export const populateFormWithUserData = (form: any, firstName?: string, lastName?: string, email?: string) => {
  if (form.user) {
    if (firstName) {
      form.user.firstName = firstName
    }
    if (lastName) {
      form.user.lastName = lastName
    }
    if (email) {
      form.user.email = email
    }
  }
}
