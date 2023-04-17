import auth from '@/services/auth'

export default {
  async beforeRouteEnter(to, from, next) {
    // user info is only accessible on the client side
    if (process.env.VUE_ENV === 'client') {
      const user = await auth.user()
      if (user != null) {
        return next()
      } else {
        return next("/")
      }
    }
    else {
      next(false)
    }
  }
}
