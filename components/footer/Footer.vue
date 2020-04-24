<template>
  <div class="footer container">
    <div class="footer__info">
      <div class="footer__info--logo">
        <nuxt-link :to="{ name: 'index' }">
          <sparc-logo />
        </nuxt-link>
      </div>
      <div class="footer__info--blurb">
        <p>
          {{ footerData }}
        </p>
      </div>
      <div class="footer__info--social">
        <a href="https://twitter.com/sparc_science" target="_blank">
          <svg-icon icon="icon-twitter" color="#606266" />
        </a>
        <a
          href="https://www.youtube.com/results?search_query=sparc+nih"
          target="_blank"
        >
          <svg-icon icon="icon-youtube" color="#606266" />
        </a>
      </div>
      <div class="footer__info--copyright">
        <p>
          <nuxt-link class="underline" :to="{ name: 'privacy' }">
            Privacy Policy
          </nuxt-link>
        </p>
      </div>
    </div>
    <div class="footer__links">
      <div class="footer__links--learn">
        <h3>Learn More</h3>
        <ul>
          <li>
            <nuxt-link :to="{ name: 'about' }">
              About SPARC
            </nuxt-link>
          </li>
          <li>
            <a href="https://commonfund.nih.gov/sparc/awards" target="_blank">
              Funding Opportunities
            </a>
          </li>
          <li>
            <a href="https://commonfund.nih.gov/Sparc/" target="_blank">
              NIH SPARC Program
            </a>
          </li>
          <li>
            <a href="http://status.sparc.science/" target="_blank">Site Status</a>
          </li>
        </ul>
        <h3>Help us Improve</h3>
        <ul>
          <li>
            <a
              href="https://www.wrike.com/frontend/requestforms/index.html?token=eyJhY2NvdW50SWQiOjMyMDM1ODgsInRhc2tGb3JtSWQiOjI2NzEzMn0JNDcyNTk5ODQyNjYyOAllODRhYTBkZWQ2ODY2Y2U3OWNhZWI5ODkyZWMwNjgyNTBiZjExMDIzMjk4MGMxZGM1MGNhYzY0ZmQxOGMxN2Ji"
              target="_blank"
            >
              Site Feedback
            </a>
          </li>
        </ul>
        <h3>Stay Up-to-Date</h3>
        <ul>
          <li>
            <a
              href="https://list.nih.gov/cgi-bin/wa.exe?SUBED1=NIH-SPARC-INFO&A=1"
              target="_blank"
            >
              Join our E-mail list
            </a>
          </li>
        </ul>
      </div>
      <div class="footer__links--social-mobile">
        <a href="https://twitter.com/sparc_science" target="_blank">
          <svg-icon icon="icon-twitter" color="#606266" />
        </a>
        <a
          href="https://www.youtube.com/results?search_query=sparc+nih"
          target="_blank"
        >
          <svg-icon icon="icon-youtube" color="#606266" />
        </a>
      </div>
      <div class="footer__links--copyright-mobile">
        <p>
          <nuxt-link class="underline" :to="{ name: 'terms-of-service' }">
            Terms of Service
          </nuxt-link>
          |
          <nuxt-link class="underline" :to="{ name: 'privacy' }">
            Privacy Policy
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import SparcLogo from '@/components/logo/SparcLogo.vue'
import { mapState } from 'vuex'

export default {
  name: 'SparcFooter',
  components: {
    SparcLogo
  },

  computed: {
    ...mapState({
      footerData: 'footerData'
    })
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
    @media (min-width: 64em) {
      padding-right: 12rem;
    }

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
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    &--social-mobile {
      display: none;
    }

    &--copyright-mobile {
      display: none;
    }
  }
}

@media screen and (max-width: 1023px) {
  .footer {
    display: flex;
    flex-direction: column;
    padding-top: 3rem;

    &__info {
      width: 100%;
      &--logo {
        height: 2rem;
        padding-left: 2rem;
      }

      &--blurb {
        padding-left: 2rem;
        padding-right: 1rem;
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;

        p {
          padding-bottom: 1rem;
        }
      }

      &--social {
        display: none;
      }

      &--copyright {
        display: none;
      }
    }

    &__links {
      padding-left: 2rem;
      width: 65%;

      &--social-mobile {
        display: block;
        padding-bottom: 1rem;
        .svg-icon {
          width: 2.2rem;
          margin-right: 1rem;
        }
      }

      &--copyright-mobile {
        display: block;
        p {
          font-size: 12px;
          font-weight: 500;
          color: $dark-gray;
        }

        a {
          color: $dark-gray;
        }
      }
    }
  }
}
</style>
