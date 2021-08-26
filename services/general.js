import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.portal_api,
  withCredentials: false,
  timeout: 20000
})

const lookupOntoTerm = async term => {
  const config = {
    params: {
      term
    }
  }
  const response = await apiClient.get('/onto_term_lookup', config)
  return response.data
}

export default {
  lookupOntoTerm
}
