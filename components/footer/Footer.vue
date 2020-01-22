<template>
  <div class="footer container">
    <div class="footer__info">
      <div class="footer__info--logo">
        <sparc-logo />
      </div>
      <div class="footer__info--blurb">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing sed do eiusmod tempor incididunt ut labore et dolore eiusmod magna aliqua.
          Ut enim minim veniam, quis anim exercitation ullamco laboris nis ut aliquip ex commodo consequat.
          Dus aute irure dolor in consectetur reprehenderit in voluptate velit esse cillum dolore fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat proident.
        </p>
      </div>
      <div class="footer__info--social">
        <a href="https://twitter.com/sparc_science">
          <svg-icon icon="icon-twitter" color="#606266" />
        </a>
        <a href="https://www.youtube.com/results?search_query=sparc+nih">
          <svg-icon icon="icon-youtube" color="#606266" />
        </a>
      </div>
      <div class="footer__info--copyright">
        <p>Data Resource Center &copy; 2020 All rights reserved. <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </div>
    </div>
    <div class="footer__links">
      <div class="footer__links--learn">
        <h3>Learn More</h3>
        <ul>
          <li>
            <a href="#">About SPARC</a>
          </li>
          <li>
            <a href="#">Funding Opportunities</a>
          </li>
          <li>
            <a href="#">NIH SPARC</a>
          </li>
        </ul>
        <h3>Help us Improve</h3>
        <ul>
          <li>
            <a href="#">Site Feedback</a>
          </li>
          <li>
            <a href="#">Report a Bug</a>
          </li>
        </ul>
        <h3>Stay Up-to-Date</h3>
        <ul>
          <li>
            <a href="#">Join our E-mail list</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SparcLogo from '@/components/logo/SparcLogo.vue'

export default {
  name: 'SparcFooter',
  components: {
    SparcLogo
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';

.footer {
  display: flex;
  flex-direction: row;
  padding-top: 5rem;
  padding-bottom: 3rem;

  &__info {
    width: 80%;
    padding-right: 12rem;

    &--logo {
      height: 4rem;
      padding-bottom: 1rem;
    }

    &--blurb {
      p {
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        color: $dark-gray;
        padding-bottom: 2rem;
      }
    }

    &--social {
      .svg-icon {
        width: 2.2rem;
        margin-right: 1rem;
      }
      padding-bottom: 2rem;
    }

    &--copyright {
      p {
        color: $dark-gray;
        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
      }

      a {
        color: $dark-gray;
      }
    }
  }

  &__links {
    width: 50%;

    &--learn {
      h3 {
        font-size: 16px;
        font-weight: bold;
        line-height: 32px;
        color: $dark-gray;
      }
      ul {
        list-style: none;
        padding-left: 0;

        li {
          padding-bottom: 1rem;
        }

        a {
          color: $dark-gray;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
