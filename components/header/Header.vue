<template>
  <div class="header">
    <div class="header__nav">
      <div class="header__nav--parent-links">
        <img src="https://placeholder.pics/svg/18x18" />
        <a href="#">
          About SPARC
        </a>
        <img src="https://placeholder.pics/svg/18x18" />
        <a href="#">
          Contact Us
        </a>
        <img src="https://placeholder.pics/svg/18x18" />
        <a href="#">
          Need Help?
        </a>
      </div>
      <div class="header__nav--main-links">
        <div class="logo">
          <sparc-logo />
        </div>
        <a href="#">Home</a>
        <a href="#">Find Data</a>
        <a href="#">Resources</a>
        <a href="#">News & Events</a>
        <input type="text" class="search" placeholder="Search" />
        <button class="search-button" @click="executeSearch">
          <svg-icon color="white" name="icon-magnifying-glass" height="20" width="20" />
        </button>
      </div>
      <div class="header__content">
        <div class="header__content--container">
          <h3 class="header__content--container-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </h3>
        <button class="header__content--container-button" @click="browseData">
          Browse All Data
        </button>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="nav">
    <el-row type="flex" justify="center">
      <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
        <div class="header">
          <div class="logo">
            <sparc-logo />
          </div>
          <button class="btn-menu" @click="menuOpen = true">
            <i class="el-icon-s-fold" />
          </button>
          <div class="navigation" :class="{ open: menuOpen }">
            <div class="mobile-navigation-header">
              <sparc-logo aria-hidden="”true”" role="presentation" />
              <button class="btn-menu" @click="menuOpen = false">
                <i class="el-icon-close" />
              </button>
            </div>
            <ul>
              <li v-for="link in links" :key="link.href">
                <a :class="{ active: link.active }" :href="link.href">{{
                  link.title
                }}</a>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div> -->
</template>

<script>
import SparcLogo from '../logo/SparcLogo.vue'

const path = () => ''
const hash = () => ''

const pathOrHashContainsString = query =>
  path().indexOf(query) > -1 || hash().indexOf(query) > -1

const links = [
  {
    title: 'Home',
    href: '/',
    active:
      pathOrHashContainsString('/') &&
      !pathOrHashContainsString('/about') &&
      !pathOrHashContainsString('/browse') &&
      !pathOrHashContainsString('/map') &&
      !pathOrHashContainsString('/sim')
  },
  {
    title: 'Explore Data',
    href: '/data',
    active: pathOrHashContainsString('/data')
  },
  {
    title: 'SPARC Resources',
    href: '/map',
    active: pathOrHashContainsString('/map')
  },
  {
    title: 'SPARC Events',
    href: '/events',
    active: pathOrHashContainsString('/events')
  },
  {
    title: 'About',
    href: '/about',
    active: pathOrHashContainsString('/about')
  },
  {
    title: 'Help',
    href: '/help',
    active: pathOrHashContainsString('/help')
  }
]

export default {
  name: 'SparcHeader',
  components: {
    SparcLogo
  },
  data: () => ({
    links,
    menuOpen: false
  })
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
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  // align-items: flex-end;
  @media screen and (max-width: 767px) {
    align-items: center;
  }
}

.header__nav {
  background-color: $navy;
  height: 40px;
}

.header__nav--parent-links {
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
    font-weight: 500;
    line-height: 24px;
    color: $cochlear;
    padding-right: 18px;
    text-decoration: none;
  }
}

.header__nav--main-links {
  height: 82px;
  background-color: $cochlear;
  padding-top: 30px;
  padding-left: 33px;
  display: flex;
  flex-direction: row;

  a {
    color: $app-secondary-color;
    font-size: 16px;
    line-height: 32px;
    font-weight: 500;
    padding-top: 5px;
    padding-right: 91px;
  }
}

.logo {
  height: 62px;
  width: 127px;
  white-space: nowrap;
  margin-right: 78px;
}

.search {
  width: 400px;
  height: 34px;
  border-radius: 4px;
  border: solid 1px $dark-gray;
  margin-top: 2px;
  margin-left: 60px;
}

.search-button {
  background-color: $dark-median;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-left: 9px;
}

::placeholder {  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: lightgray;
  opacity: 1; /* Firefox */
  font-size: 14px;
  font-weight: 300;
  line-height: 32px;
  padding-left: 7px;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: lightgray;
  font-size: 14px;
  font-weight: 300;
  line-height: 32px;
  padding-left: 7px;
}

.header__content {
  height: 278px;
  background-image: linear-gradient(90deg, #0c00bf, #bc00fc);
}

.header__content--container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header__content--container-text {
  color: $cochlear;
  font-size: 26px;
  font-weight: 500;
  line-height: 38px;
  text-align: center;
  padding-top: 48px;
  padding-right: 192px;
  padding-left: 192px;
  padding-bottom: 32px;
}

.header__content--container-button {
  border-radius: 4px;
  background-color: $cochlear;
  color: black;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  text-align: center;
  width: 155px;
  height: 40px;
  padding: 8px 10px 8px 13px;
}

.btn-menu {
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
  i {
    display: block;
  }
}

.navigation {
  padding: 0px;
  height: 100%;

  ul {
    li {
      display: inline;
      margin: 0px 10px;

      a {
        text-decoration: none;
        color: black;
        padding-bottom: 10px;

        &.active {
          border-bottom: 2px solid #8300bf;
          color: #8300bf;
        }

        &:hover {
          color: #8300bf;
        }
      }
    }
  }
  .mobile-navigation-header {
    display: none;
  }

  @media screen and (max-width: 767px) {
    & {
      background: #f7faff;
      bottom: 0;
      display: none;
      flex-direction: column;
      left: 0;
      padding: 1em;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 9999;
      &.open {
        display: flex;
      }
    }
    ul {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin: 0;
      padding: 0;
      li {
        margin: 1.25em 0;
      }
    }
    .mobile-navigation-header {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1em;
    }
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
