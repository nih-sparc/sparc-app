import createClient from '~/plugins/contentful'
import { propOr } from 'ramda'

export const state = () => ({
  formOptions: {
    userTypes: [],
    areasOfSparc: [],
    services: [],
    resourceCategories: []
  }
})

export const mutations = {
  SET_FORM_OPTIONS(state, data) {
    state.formOptions = data
  }
}

export const actions = {
  async fetchContactUsFormOptions({ commit, dispatch }) {
    try {
      const client = createClient()
      const response = await client.getEntry(process.env.ctf_contact_us_form_options_id)
      const fields = response.fields

      const formOptions = {
        userTypes: propOr([], 'typeOfUser', fields),
        areasOfSparc: propOr([], 'areaOfSparcPortal', fields),
        services: propOr([], 'services', fields),
        resourceCategories: propOr([], 'resourceCategories', fields)
      }
      
      commit('SET_FORM_OPTIONS', formOptions)
    } catch (e) {
      console.error(e)
    }
  }
}
