export default function ({ route, redirect, app, store }) {
  const userToken = app.$cookies.get('user-token')  || store.getters['user/cognitoUserToken']
  if (userToken) {
    // If the user is logged in and their profile is incomplete then make sure they complete it. Otherwise, do not allow them to visit the welcome page again
    const profileComplete = app.$cookies.get('profile-complete') || store.getters['user/profileComplete']
    if (!profileComplete) {
      if (route.name !== 'welcome') {
        redirect("/welcome")
      }
    } else if (route.name === 'welcome') {
      redirect("/")
    }
  }
}
