<template>
  <div class="header">
    <div class="header__nav">
      <div class="header__nav--parent">
        <img src="https://placeholder.pics/svg/18x18" />
        <nuxt-link :to="{ name: 'about' }">
          About SPARC
        </nuxt-link>
        <img src="https://placeholder.pics/svg/18x18" />
        <a href="#">
          Contact Us
        </a>
        <img src="https://placeholder.pics/svg/18x18" />
        <nuxt-link :to="{ name: 'help' }">
          Need Help?
        </nuxt-link>
      </div>
      <div class="header__nav--main">
        <div class="nav-main-container">
          <button
            class="nav-main-container__mobile-menu"
            @click="openMobileNav"
          >
            <svg-icon
              color="black"
              icon="icon-hamburger"
              height="25"
              width="25"
            />
          </button>
          <div class="logo">
            <sparc-logo />
          </div>
          <button
            v-if="shouldShowSearch"
            class="nav-main-container__mobile-search"
            @click="openMobileSearch"
            @enter="executeSearch"
          >
            <svg-icon
              color="black"
              icon="icon-magnifying-glass"
              height="25"
              width="25"
            />
          </button>
          <div v-if="searchOpen" class="search-mobile">
            <input type="text" placeholder="Search" />
            <button class="search-mobile__close" @click="closeMobileSearch">
              <svg-icon icon="icon-remove" class="search-mobile__close--icon" />
            </button>
          </div>
          <div class="mobile-navigation" :class="[menuOpen ? 'open' : '']">
            <ul>
              <li v-for="link in links" :key="link.href">
                <nuxt-link
                  :to="{ name: link.title }"
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
                <img src="https://placeholder.pics/svg/20x20" />
                <nuxt-link :to="{ name: 'about' }">
                  About SPARC
                </nuxt-link>
              </li>
              <li>
                <img src="https://placeholder.pics/svg/20x20" />
                <a href="#">Contact Us</a>
              </li>
              <li>
                <img src="https://placeholder.pics/svg/20x20" />
                <nuxt-link :to="{ name: 'help' }">
                  Need Help?
                </nuxt-link>
              </li>
            </ul>
            <div class="mobile-navigation__links--social">
              <a href="https://twitter.com/sparc_science">
                <svg-icon
                  icon="icon-twitter"
                  width="30"
                  height="26"
                  color="#606266"
                />
              </a>
              <a href="https://www.youtube.com/results?search_query=sparc+nih">
                <svg-icon
                  icon="icon-youtube"
                  width="30"
                  height="26"
                  color="#606266"
                />
              </a>
            </div>
          </div>
          <div v-if="shouldShowSearch" class="nav-main-container__search">
            <input
              v-model="searchQuery"
              type="text"
              class="nav-main-container__search-input"
              placeholder="Search"
            />
            <button
              class="nav-main-container__search-button"
              @click="executeSearch"
            >
              <svg-icon
                color="white"
                icon="icon-magnifying-glass"
                height="25"
                width="25"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SparcLogo from '../logo/SparcLogo.vue'

const links = [
  {
    title: 'index',
    displayTitle: 'Home',
    href: '/'
  },
  {
    title: 'data',
    displayTitle: 'Find Data',
    href: '/data'
  },
  {
    title: 'resources',
    displayTitle: 'Resources',
    href: '/resources'
  },
  {
    title: 'events',
    displayTitle: 'News & Events',
    href: '/events'
  }
]

export default {
  name: 'SparcHeader',
  components: {
    SparcLogo
  },
  data: () => ({
    links,
    menuOpen: false,
    searchOpen: false,
    searchQuery: ''
  }),

  computed: {
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
    }
  },

  methods: {
    /**
     * Sets a link to active based on current page
     * @param {String} query
     */
    activeLink: function(query) {
      if (this.$nuxt.$route.path === query) {
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
        this.searchOpen = false // just in case the search menu is open also
        this.menuOpen = true
      } else {
        this.menuOpen = false
      }
    },

    /**
     * Opens the mobile version of the search bar
     */
    openMobileSearch: function() {
      this.searchOpen = true
      this.menuOpen = false
    },

    /**
     * Closes the mobile version of the search bar
     */
    closeMobileSearch: function() {
      this.searchOpen = false
    },

    /**
     * Executes a search query
     */
    executeSearch: function() {
      this.$router.push({
        name: 'data',
        query: {
          q: this.searchQuery,
          type: 'dataset'
        }
      })

      this.searchQuery = ''
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
  @media (min-width: 320px) and (max-width: 767px) {
    align-items: center;
  }
}

.divider {
  display: none;
  @media screen and (max-width: 767px) {
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
  img {
    margin-right: 5px;
  }
  a {
    font-size: 13px;
    font-family: $system-font;
    font-weight: 400;
    line-height: 24px;
    color: $cochlear;
    padding-right: 18px;
    text-decoration: none;
  }
  @media (min-width: 320px) and (max-width: 767px) {
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
  @media (min-width: 320px) and (max-width: 767px) {
    height: 41px;
    padding-left: 0;
    padding-top: 13px;
    .nav-main-container__mobile-menu {
      padding-left: 2px;
      padding-top: 13px;
    }
  }

  .mobile-navigation__links {
    display: none;
    &--social {
      display: none;
    }
    @media (min-width: 320px) and (max-width: 767px) {
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
  display: none;
  @media (min-width: 320px) and (max-width: 767px) {
    display: flex;
    padding-bottom: 0.5rem;
  }
}

.nav-main-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  @media (min-width: 320px) and (max-width: 767px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.logo {
  height: 62px;
  width: 127px;
  white-space: nowrap;
  margin-right: 48px;
  @media (min-width: 320px) and (max-width: 767px) {
    height: 2rem;
    width: 100%;
    margin-right: 0;
    padding-top: 0.1rem;
  }
}

.nav-main-container__search {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 28%;
  }
  @media (min-width: 320px) and (max-width: 767px) {
    width: 0;
  }
}

.nav-main-container__search-input {
  width: 22vw;
  height: 34px;
  border-radius: 4px;
  border: solid 1px $dark-gray;
  margin-top: 2px;
  padding-left: 1rem;
  @media screen and (max-width: 767px) {
    display: none;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 100%;
  }
}

.nav-main-container__search-button {
  background-color: $median;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-left: 9px;
  border: none;
  @media screen and (max-width: 767px) {
    display: none;
  }
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: lightgray;
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
  display: none;
  font-size: 24px;
  margin: 0;
  padding: 10px;
  transform: translate(12px, -8px);
  -webkit-appearance: none;

  @media screen and (max-width: 767px) {
    & {
      display: block;
    }
  }
}

.mobile-navigation {
  padding: 0px;
  height: 100%;
  width: 62%;
  margin-left: 1rem;

  ul {
    padding-left: 0;
    margin-top: 0.5rem;
    li {
      display: inline;
      padding-right: 5rem;
      @media (min-width: 320px) and (max-width: 767px) {
        padding-right: 2rem;
      }

      a {
        text-decoration: none;
        color: $navy;
        padding-bottom: 10px;
        font-weight: 500;

        &.active {
          border-bottom: 2px solid $median;
          color: $median;
        }

        &:hover {
          color: $median;
        }
      }
    }
  }

  @media (min-width: 320px) and (max-width: 767px) {
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

@media (min-width: 320px) and (max-width: 767px) {
  .search-mobile {
    background-color: $cochlear;
    flex-direction: column;
    left: 0;
    padding: 1em;
    padding-top: 12px;
    padding-bottom: 14px;
    position: fixed;
    right: 6rem;
    top: 3.4rem;
    z-index: 9999;
    display: flex;
    width: 100%;
    height: 1.4rem;
    border-top: solid 1px lightgray;

    &__close {
      width: 27px;
      height: 30px;
      position: inherit;
      right: 0.8rem;
    }

    &--icon {
      color: $neutral-gray;
      width: 20px;
      height: 20px;
    }
  }

  input {
    height: 2rem;
    font-size: 16px;
    width: 90%;
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: lightgrey;
    opacity: 1; /* Firefox */
    font-size: 16px;
    font-weight: 300;
    line-height: 32px;
    padding-left: 7px;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: lightgrey;
    font-size: 16px;
    font-weight: 300;
    line-height: 32px;
    padding-left: 7px;
  }
}

.data-portal-title {
  font-family: 'SF Pro Text';
  font-size: 14px;
  color: #303133;
  line-height: 14px;
  position: relative;
  bottom: 5px;
  margin-left: 5px;
  user-select: none;
}
</style>
