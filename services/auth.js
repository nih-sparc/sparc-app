import { Auth } from '@aws-amplify/auth'
import { Hub } from '@aws-amplify/core';
import { pathOr } from 'ramda'
import axios from 'axios'

// There is a cognito issue with FederatedSignIn where the first time a user attemptes to sign in it throws an 'Already+found+an+entry+for+username' error.
// It cannot be caught in a normal try catch because it gets thrown early on in the OAuth flow so we must import Hub to listen for it. 
// This thread outlines the issue: https://stackoverflow.com/questions/47815161/cognito-auth-flow-fails-with-already-found-an-entry-for-username-facebook-10155

let signInAttempts = 0;

Hub.listen('auth', async (data) => {
  switch (data.payload.event) {
    case 'signIn_failure':
      if (data.payload.data.message.includes("Already+found+an+entry+for+username") && signInAttempts < 1) {
        signInAttempts ++;
        // We simply attempt to sign in again since this error only happens for the first sign in
        await signIn('ORCID')
      }
      break;
    case 'signOut':
    case 'signIn':
      signInAttempts = 0;
  }   
});

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
      const request = `${process.env.LOGIN_API_URL}/user?api_key=${userToken}`
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
