import { Auth } from '@aws-amplify/auth'
import { pathOr } from 'ramda'
import axios from 'axios'

const user = async() => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    return user
  } catch (err) {
    console.log("Could not get user: ", err)
    return null
  }
}

// The Pennsieve user profile
const userProfile = async() => {
  const cognitoUser = await user()
  if (cognitoUser) {
    const userToken = pathOr('', ['signInUserSession', 'accessToken', 'jwtToken'], cognitoUser)
    if (userToken) {
      const request = `${process.env.USER_ACTIONS_API_URL}/user?api_key=${userToken}`
      return await axios.get(request).then(userProfile => {
        return userProfile.data
      })
      .catch(err => {
        console.log(`Error retrieving pennsieve user: ${err}`)
        return null
      })
    }
  } else {
    return null
  }
}

const signIn = async(providerName) => {
  try {
    await Auth.federatedSignIn({customProvider: providerName})
  } catch (err) {
    console.log("Error signing in: ", err)
  }
}

const signOut = async() => {
  try {
    await Auth.signOut()
  } catch (err) {
    console.log("Error signing out: ", err)
  }
}

export default {
  user,
  userProfile,
  signIn,
  signOut
}
