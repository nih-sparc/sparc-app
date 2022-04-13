export default function ({ route, redirect, app }) {
  const userToken = app.$cookies.get('user-token')
  if (userToken) {
    // If the user is logged in and their profile is incomplete then make sure they complete it. Otherwise, do not allow them to visit the welcome page again
    const profileComplete = app.$cookies.get('profile-complete')
    if (!profileComplete) {
      if (route.name !== 'welcome') {
        redirect("/welcome")
      }
    } else if (route.name === 'welcome') {
      redirect("/")
    }
  }
}
