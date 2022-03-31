<template>
  <div class="header">
    <div class="header__nav">
      <div class="header__nav--parent">
        <svg-icon class="pr-4" icon="icon-contact" width="18" height="18" />
        <nuxt-link to="/contact-us" target="_blank">
          Contact Us
        </nuxt-link>
        <svg-icon class="pr-4" icon="icon-help" width="18" height="18" />
        <nuxt-link :to="{ name: 'help' }">
          Help
        </nuxt-link>
        <template v-if="showLoginFeature">
          <svg-icon icon="icon-sign-in" style="padding-top: .125rem" height="16" width="16" />
          <a v-if="!loggedInUser" class="sign-in-link" @click="onLoginWithORCID">
            Sign in
          </a>
          <el-menu class="mr-16 user-menu" v-else popper-class="user-popper" background-color="#24245b" mode="horizontal" @select="handleUserMenuSelect">
            <el-submenu index="user">
              <template slot="title">{{username}}</template>
              <!--<el-menu-item class="user-submenu" index="account">My account</el-menu-item>-->
              <el-menu-item class="user-submenu" index="logout">Logout</el-menu-item>
            </el-submenu>
          </el-menu>
        </template>
      </div>
      <div class="header__nav--main">
        <div class="nav-main-container">
          <button
            class="nav-main-container__mobile-menu"
            @click="openMobileNav"
          >
            <svg-icon icon="icon-hamburger" height="25" width="25" />
          </button>
          <div class="logo">
            <nuxt-link :to="{ name: 'index' }">
              <sparc-logo />
            </nuxt-link>
          </div>
          <button
            v-if="shouldShowSearch"
            class="nav-main-container__mobile-search"
            @click="openMobileSearch"
            @enter="executeSearch(searchQuery)"
          >
            <svg-icon
              icon="icon-magnifying-glass"
              height="25"
              width="25"
              dir="left"
            />
          </button>
          <div :class="[mobileSearchOpen ? 'search-overlay' : '']">
            <search-form
              v-if="mobileSearchOpen"
              :defaultValue="searchQuery"
              placeholder="Search Datasets"
              class="search-mobile"
              @search="executeMobileSearch"
              @clear="searchQuery = ''"
            />
            <div
              v-if="mobileSearchOpen"
              class="click-outside-mobile-search-catch"
              @click="mobileSearchOpen = false"
            />
          </div>

          <div :class="[menuOpen ? 'overlay' : '']">
            <div class="mobile-navigation" :class="[menuOpen ? 'open' : '']">
              <ul>
                <li
                  v-for="link in links"
                  :key="link.href"
                  style="z-index: 100;"
                >
                  <nuxt-link
                    :to="link.href"
                    :class="{ active: activeLink(link.href) }"
                    exact-active-class="active"
                  >
                    {{ link.displayTitle }}
                  </nuxt-link>
                </li>
                <hr class="divider" />
              </ul>
              <ul class="mobile-navigation__links">
                <li>
                  <svg-icon icon="icon-contact" width="18" height="18" />
                  <nuxt-link to="/contact-us" target="_blank">
                    Contact Us
                  </nuxt-link>
                </li>
                <li>
                  <svg-icon icon="icon-help" width="18" height="18" />
                  <nuxt-link :to="{ name: 'help' }">
                    Help
                  </nuxt-link>
                </li>
                <li v-if="showLoginFeature">
                  <svg-icon icon="icon-sign-in" style="padding-left: .125rem" height="18" width="18" />
                  <a v-if="!loggedInUser" class="sign-in-link" @click="onLoginWithORCID">
                    Sign in
                  </a>
                  <a v-else class="sign-in-link" @click="handleUserMenuSelect('logout', ['user','logout'])">
                    Logout
                  </a>
                </li>
              </ul>
              <div class="mobile-navigation__links--social">
                <a href="https://twitter.com/sparc_science" target="_blank">
                  <svg-icon
                    icon="icon-twitter"
                    width="30"
                    height="26"
                    color="#606266"
                  />
                </a>
                <a
                  href="https://www.youtube.com/results?search_query=sparc+nih"
                  target="_blank"
                >
                  <svg-icon
                    icon="icon-youtube"
                    width="30"
                    height="26"
                    color="#606266"
                  />
                </a>
              </div>
            </div>
          </div>
          <div v-if="shouldShowSearch" class="nav-main-container__search">
            <el-input
              v-model="searchQuery"
              type="text"
              class="nav-main-container__search-input"
              placeholder="Search"
              @keyup.native.enter="executeSearch(searchQuery)"
            >
              <el-select slot="prepend" v-model="searchSelect">
                <el-option
                  v-for="option in searchSelectOptions"
                  :key="option.key"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-input>
            <el-button
              class="search-button px-8 py-0 ml-8"
              @click="executeSearch(searchQuery)"
            >
              <svg-icon
                color="white"
                icon="icon-magnifying-glass"
                height="25"
                width="25"
                dir="left"
              />
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SparcLogo from '../logo/SparcLogo.vue'
import SearchForm from '@/components/SearchForm/SearchForm.vue'
import Request from '@/mixins/request'
import { mapState } from 'vuex'

const links = [
  {
    title: 'data',
    displayTitle: 'Find Data',
    href: '/data'
  },
  {
    title: 'resources',
    displayTitle: 'Tools & Resources',
    href: `/resources`
  },
  {
    title: 'maps',
    displayTitle: 'Maps',
    href: '/maps'
  },
  {
    title: 'news-and-events',
    displayTitle: 'News & Events',
    href: '/news-and-events'
  },
  {
    title: 'about',
    displayTitle: 'About',
    href: '/about'
  }
]

export default {
  name: 'SparcHeader',
  components: {
    SparcLogo,
    SearchForm
  },
  mixins: [Request],
  mounted() {
    if (this.showLoginFeature) {
      this.$store.dispatch('user/fetchUser')
    }
  },
  data: () => {
    return {
      links,
      menuOpen: false,
      mobileSearchOpen: false,
      searchQuery: '',
      searchSelect: 'data',
      username: "",
      showLoginFeature: process.env.SHOW_LOGIN_FEATURE,
      searchSelectOptions: [
        {
          key: 'data',
          value: 'data',
          label: 'Datasets'
        },
        {
          key: 'resources',
          value: 'resources',
          label: 'Resources'
        },
        {
          key: 'news-and-events',
          value: 'news-and-events',
          label: 'News and Events'
        },
        {
          key: 'help',
          value: 'help',
          label: 'Help'
        }
      ]
    }
  },

  computed: {
    ...mapState('user', ['loggedInUser']),
    /**
     * Compute if search should be visible
     * @returns {Boolean}
     */
    shouldShowSearch: function() {
      return this.$route.name !== 'data'
    }
  },

  watch: {
    /**
     * Watches for the route path to hide
     * mobile nav on menu click
     **/
    '$nuxt.$route.path': {
      handler: function(val) {
        if (val) {
          this.menuOpen = false
        }
      },
      immediate: true
    },

    loggedInUser: {
      handler: function(newUser) {
        if (newUser) {
          this.fetchUsername(this.loggedInUser)
        }
      },
    },

    /**
     * Watches menuOpen to check if it's false
     * to enable scrolling
     */
    menuOpen: {
      handler: function(val) {
        if (!val) {
          this.$store.dispatch('layouts/default/updateDisabledScrolling', false)
        }
      },
      immediate: true
    }
  },

  methods: {
    handleUserMenuSelect(menuId, menuIdPath) {
      if (menuId === 'logout') {
        this.$store.dispatch('user/logout')
      }
    },
    onLoginWithORCID: async function(x) {
      x.preventDefault()
      await this.$store.dispatch('user/login', 'ORCID')
    },
    fetchUsername: function() {
      let token = this.$store.getters['user/userToken']
      let url = `https://api.pennsieve.net/user?api_key=${token}`
      this.sendXhr(url).then(this.setUsername, this.failureCallback)
    },
    setUsername: function(result) {
      if (`${result.firstName[0]}` !== null && `${result.lastName}` !== null){
        this.username = `${result.firstName[0]}. ${result.lastName}`}
      else {
        this.username = `${result.email}`
      }
    },
    failureCallback: function(error) {
      console.log(error)
    },
    /**
     * Sets a link to active based on current page
     * @param {String} query
     */
    activeLink: function(query) {
      if (this.$nuxt.$route.path.includes(query)) {
        return true
      } else {
        return false
      }
    },
    /**
     * Opens the mobile version of the navigation
     */
    openMobileNav: function() {
      if (!this.menuOpen) {
        this.mobileSearchOpen = false // just in case the search menu is open also
        this.$store.dispatch('layouts/default/updateDisabledScrolling', true)
        this.menuOpen = true
      } else {
        this.menuOpen = false
        this.$store.dispatch('layouts/default/updateDisabledScrolling', false)
      }
    },

    /**
     * Opens the mobile version of the search bar
     */
    openMobileSearch: function() {
      this.mobileSearchOpen = true
      this.menuOpen = false
      this.$store.dispatch('layouts/default/updateDisabledScrolling', true)
    },

    /**
     * Closes the mobile version of the search bar
     */
    closeMobileSearch: function() {
      this.mobileSearchOpen = false
      this.$store.dispatch('layouts/default/updateDisabledScrolling', false)
    },

    executeMobileSearch: function(term) {
      this.executeSearch(term)
      this.closeMobileSearch()
    },

    /**
     * Executes a search query based on selected
     * option and query
     */
    executeSearch: function(term) {
      const option = this.searchSelectOptions.find(
        o => o.value === this.searchSelect
      )

      // Set up an object for the nuxt router
      let type = option.value
      let routeParams = {
        name: type,
        query: {
          type,
          seach: term
        }
      }

      // Searching on 'data' takes user directly to the dataset, as opposed to the /data page
      if (option.value === 'data'){
        type = 'dataset'
        routeParams = {
          name: 'dataset',
          query: {
            type,
            q: term
          }
        }
      }
      // Searching on 'resources' takes user to the /data page with thier query
      else if (option.value === 'resources') {
        type = 'sparcPartners'
        routeParams = {
          name: 'data',
          query: {
            type,
            q: term,
            developedBySparc: true
          }
        }
      }

      this.$router.push(routeParams)

      this.searchQuery = ''
      this.searchSelect = 'data'
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';

.nav {
  height: 4em;
  padding: 0;
  padding-top: 1rem;
}

.header {
  width: 100%;
  display: flex;
  flex-direction: row;
  @media (min-width: 320px) and (max-width: 1120px) {
    align-items: center;
  }
}
@media (min-width: 320px) and (max-width: 1120px) {
  .overlay {
    position: absolute;
    top: 56px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

@media (min-width: 320px) and (max-width: 1120px) {
  .search-overlay {
    position: absolute;
    top: 56px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.divider {
  display: none;
  @media screen and (max-width: 1120px) {
    border: 0;
    clear: both;
    display: block;
    width: 89%;
    background-color: $pudendal;
    height: 1px;
    margin-left: 0;
    margin-top: 11px;
  }
}

.header__nav {
  background-color: $navy;
  width: 100%;
}

.header__nav--parent {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 8px;
  .svg-icon {
    align-self: center;
    color: white;
  }
  img {
    margin-right: 5px;
  }
  a {
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: $cochlear;
    padding-right: 18px;
    text-decoration: none;
  }
  @media (min-width: 320px) and (max-width: 1120px) {
    & {
      display: none;
    }
  }
}

.header__nav--main {
  height: 82px;
  background-color: $cochlear;
  padding-top: 30px;
  padding-left: 33px;
  display: flex;
  flex-direction: row;
  @media (min-width: 320px) and (max-width: 1120px) {
    height: 41px;
    padding-left: 0;
    padding-top: 13px;
    .nav-main-container__mobile-menu {
      padding-left: 2px;
    }
  }

  .mobile-navigation__links {
    display: none;
    &--social {
      display: none;
    }
    @media (min-width: 320px) and (max-width: 1120px) {
      display: flex;
      flex-direction: column;
      a {
        font-size: 14px;
        font-weight: 300;
        line-height: 32px;
        margin-left: 0.5rem;
      }

      &--social {
        display: flex;
        flex-direction: row;
        margin-top: 15rem;
        .svg-icon {
          margin-right: 1rem;
        }
      }
    }
  }

  a {
    color: $app-secondary-color;
    font-size: 16px;
    line-height: 32px;
    font-weight: 500;
    padding-top: 5px;
    text-decoration: none;
  }
}

.nav-main-container__mobile-search {
  background: none;
  border: none;
  color: #000;
  display: flex;
  outline: none;
  padding-bottom: 1rem;
  &:hover:not(:active),
  &:focus:not(:active) {
    color: $app-primary-color;
  }
  @media (min-width: 64em) {
    display: none;
  }
}

.nav-main-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  @media (min-width: 320px) and (max-width: 1120px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
}

.logo {
  height: 62px;
  width: 127px;
  white-space: nowrap;
  margin-right: 48px;
  @media (min-width: 320px) and (max-width: 1120px) {
    height: 2rem;
    width: 100%;
    margin-right: 0;
    padding-top: 0.1rem;
  }
}

.nav-main-container__search {
  display: flex;
  height: 40px;
  flex-direction: row;
  justify-content: flex-end;
  width: 54%;
  margin-right: 1rem;
  @media (min-width: 320px) and (max-width: 1120px) {
    width: 0;
  }
}

.nav-main-container__search-input {
  width: 30vw;
  border-radius: 4px;
  @media screen and (max-width: 1120px) {
    display: none;
  }
  .el-select {
    width: 150px;
  }
}

.search-button {
  @media screen and (max-width: 1120px) {
    display: none;
  }
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #909399;
  opacity: 1; /* Firefox */
  font-size: 14px;
  font-weight: 300;
  line-height: 32px;
  padding-left: 7px;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: lightgray;
  font-size: 14px;
  font-weight: 300;
  line-height: 32px;
  padding-left: 7px;
}

.nav-main-container__mobile-menu {
  background: none;
  border: none;
  color: #000;
  display: none;
  font-size: 24px;
  margin: 0;
  outline: none;
  padding: 10px;
  transform: translate(12px, -8px);
  -webkit-appearance: none;

  &:hover:not(:active),
  &:focus:not(:active) {
    color: $app-primary-color;
  }

  @media screen and (max-width: 1120px) {
    & {
      display: block;
    }
  }
}

.mobile-navigation {
  padding: 0px;
  height: 100%;
  margin-left: 1rem;
  width: 120%;
  ul {
    padding-left: 0;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    li {
      display: inline;
      padding-right: 5rem;
      @media screen and (min-width: 1120px) {
        padding-right: 0.5rem;
      }

      a {
        text-decoration: none;
        color: $navy;
        padding-bottom: 0.2rem;
        font-weight: 500;

        &.active,
        &:hover,
        &:focus {
          border-bottom: 2px solid $median;
          color: $median;
        }
      }
    }
  }

  @media (min-width: 320px) and (max-width: 1120px) {
    & {
      background: $seafoam;
      bottom: 0;
      display: none;
      flex-direction: column;
      left: 0;
      padding: 1em;
      position: fixed;
      right: 6rem;
      top: 3.4rem;
      z-index: 9999;
      &.open {
        display: flex;
        margin-left: 0;
        margin-right: 1rem;
        width: 70%;
        overflow: scroll;
      }
    }
    ul {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      li {
        margin: 0.25rem 0;
      }
    }
  }
}

.search-mobile {
  display: none;
}

@media (min-width: 320px) and (max-width: 1120px) {
  .search-mobile {
    background-color: $cochlear;
    padding: 1em;
    position: fixed;
    top: 3.4rem;
    z-index: 11;
    display: flex;
    width: calc(100% - 2rem);
    height: 2.5rem;
    border-top: solid 1px lightgray;
  }
}

.click-outside-mobile-search-catch {
  height: calc(100% - 8rem);
  top: 8rem;
  position: fixed;
  width: 100%;
}

.data-portal-title {
  font-size: 14px;
  color: #303133;
  line-height: 14px;
  position: relative;
  bottom: 5px;
  margin-left: 5px;
  user-select: none;
}

.sign-in-link:hover {
  cursor: pointer;
}
::v-deep .el-submenu__title:hover {
  background-color: inherit !important;
}
::v-deep .el-submenu__title {
  line-height: inherit !important;
  height: fit-content !important;
  color: white !important;
  border: none !important;
  padding: 0;
  i {
    color: white;
  }
}

.user-menu {
  border: none !important;
}
.user-submenu {
  color: #303133 !important;
  background-color: white !important;
  font-size: 14px !important;
  line-height: 32px !important;
  font-weight: medium !important;
  height: fit-content !important;
}
.user-submenu:hover {
  color: #8300bf !important;
}
</style>
