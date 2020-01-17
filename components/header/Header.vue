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
        <div class="main-links-container">
           <button class="header__nav--btn-menu" @click="menuOpen = true">
          <svg-icon color="black" icon="icon-hamburger" height="25" width="25" />
        </button>
        <div class="logo">
          <sparc-logo />
        </div>
        <button class="header__nav--btn-search" @click="searchInputOpen = true">
              <svg-icon dir="right" color="black" icon="icon-magnifying-glass" height="25" width="25" />
            </button>


        <div class="navigation" :class="{ open: menuOpen }">
          <ul>
            <li v-for="link in links" :key="link.href">
              <a :class="{ active: link.active }" href="#">{{ link.title }}</a>
            </li>
          </ul>
            <hr />
        </div>
         <div class="search-test">
            <input type="text" class="search" placeholder="Search" />
            <button class="search-button" @click="executeSearch">
              <svg-icon color="white" icon="icon-magnifying-glass" height="25" width="25" />
            </button>
          </div>
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
    title: 'Find Data',
    href: '/data',
    active: pathOrHashContainsString('/data')
  },
  {
    title: 'Resources',
    href: '/map',
    active: pathOrHashContainsString('/map')
  },
  {
    title: 'News & Events',
    href: '/events',
    active: pathOrHashContainsString('/events')
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
  width: 100%;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 767px) {
    align-items: center;
  }
}

.header__nav {
  background-color: $navy;
  height: 40px;
  width: 100%;
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
    font-family: $system-font;
    font-weight: 400;
    line-height: 24px;
    color: $cochlear;
    padding-right: 18px;
    text-decoration: none;
  }
  @media screen and (max-width: 767px) {
    & {
      display: none;
    }
  }
}

.header__nav--main-links {
  height: 82px;
  background-color: $cochlear;
  padding-top: 30px;
  padding-left: 33px;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 767px) {
    height: 41px;
    padding-left: 0;
    padding-top: 13px;
    .header__nav--btn-menu {
      padding-left: 2px;
      padding-top: 13px;
    }
  }

  a {
    color: $app-secondary-color;
    font-size: 16px;
    line-height: 32px;
    font-weight: 500;
    padding-top: 5px;
    // padding-right: 91px;
    text-decoration: none;

    &:active {
      text-decoration: underline;
    }
  }
}

.header__nav--btn-search {
  display: none;
  @media screen and (max-width: 767px) {
    display: block;
    padding-bottom: 0.5rem;
    padding-left: 9.7rem;
  }
}

.main-links-container {
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 767px) {
  }
}

.logo {
  height: 62px;
  width: 127px;
  white-space: nowrap;
  margin-right: 48px;
  @media screen and (max-width: 767px) {
    height: 2rem;
    width: 4rem;
    padding-left: 4.3rem;
    padding-top: 0.1rem;
  }
}

.search-test {
  display: flex;
  flex-direction: row;
}

.search {
  width: 400px;
  height: 34px;
  border-radius: 4px;
  border: solid 1px $dark-gray;
  margin-top: 2px;
  margin-left: 60px;
  @media screen and (max-width: 767px) {
    display: none;
  }
}

.search-button {
  background-color: $dark-median;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-left: 9px;
  @media screen and (max-width: 767px) {
    display: none;
  }
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

.header__nav--btn-menu {
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

.navigation {
  padding: 0px;
  height: 100%;

  ul {
    padding-left: 0;
    margin-top: 0.5rem;
    li {
      display: inline;
      margin: 0px 10px;
      padding-right: 55px;

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

  @media screen and (max-width: 767px) {
    & {
      background: $seafoam;
      bottom: 0;
      display: none;
      flex-direction: column;
      left: 0;
      padding: 1em;
      position: fixed;
      right: 6rem;
      top: 3.5rem;
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
        margin: 0.25rem 0;
      }
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
