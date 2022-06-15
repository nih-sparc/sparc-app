import auth from '@/services/auth'
import { pathOr } from 'ramda'

export const state = () => ({
  cognitoUser: null,
  pennsieveUser: null,
})

export const mutations = {
  SET_COGNITO_USER(state, data){
    state.cognitoUser = data
  },
  SET_PENNSIEVE_USER(state, data){
    state.pennsieveUser = data
  },
}

export const actions = {
  async login({ dispatch }, providerName){
    await auth.signIn(providerName)
    await dispatch('fetchUser')
  },
  async logout({ dispatch }){
    this.$cookies.set('user-token', null)
    await auth.signOut()
    await dispatch('fetchUser')
  },
  async fetchUser({ commit }){
    const user = await auth.user()
    const profile = await auth.userProfile()
    const token = pathOr(null, ['signInUserSession', 'accessToken', 'jwtToken'], user)
    const unixExpirationDate = pathOr('', ['signInUserSession', 'accessToken', 'payload', 'exp'], user)
    const expirationDate = unixExpirationDate ? new Date(unixExpirationDate * 1000) : null
    this.$cookies.set('profile-complete', helperMethods.isProfileComplete(profile), expirationDate)
    this.$cookies.set('user-token', token, expirationDate)
    await commit('SET_COGNITO_USER', user)
    await commit('SET_PENNSIEVE_USER', profile)
  },
}

export const getters = {
  cognitoUser (state) {
    return state.cognitoUser
  },
  pennsieveUser (state) {
    return state.pennsieveUser
  },
  pennsieveUsername (state, getters) {
    const firstName = pathOr('', ['firstName'], getters.pennsieveUser)
    const lastName = pathOr('', ['lastName'], getters.pennsieveUser)
    const abbrvLastName = lastName.length === 1 ? lastName[0] : `${lastName[0]}.`
    return `${firstName} ${abbrvLastName}`
  },
  firstName (state, getters) {
    return pathOr('', ['firstName'], getters.pennsieveUser)
  },
  lastName (state, getters) {
    return pathOr('', ['lastName'], getters.pennsieveUser)
  },
  cognitoUsername (state, getters) {
    return pathOr('', ['username'], getters.cognitoUser)
  },
  cognitoUserToken (state, getters) {
    return pathOr('', ['signInUserSession', 'accessToken', 'jwtToken'], getters.cognitoUser)
  },
  cognitoUserAttributes (state, getters) {
    return pathOr({}, ['attributes'], getters.cognitoUser)
  },
  pennsieveUserIntId (state, getters) {
    return pathOr('', ['intId'], getters.pennsieveUser)
  },
  profileColor (state, getters) {
    return pathOr('', ['color'], getters.pennsieveUser)
  },
  profileUrl (state, getters) {
    return pathOr('', ['url'], getters.pennsieveUser)
  },
  profilePreferredOrganization (state, getters) {
    return pathOr('', ['preferredOrganization'], getters.pennsieveUser)
  },
  profileEmail (state, getters) {
    return pathOr('', ['email'], getters.pennsieveUser)
  },
  profileComplete (state, getters) {
    return helperMethods.isProfileComplete(getters.pennsieveUser)
  }
}

const helperMethods = {
  isProfileComplete(profile) {
    if (profile) {
      return profile.email.split("@")[1] !== "pennsieve-nonexistent.email" && 
      profile.firstName.toLowerCase() !== "orcid" &&
      profile.lastName.toLowerCase() !== "login"
    }
    return false
  }
}
