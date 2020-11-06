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
            <a href="https://commonfund.nih.gov/sites/default/files/SPARC_material%20sharing%20policy%2026jan17_508.pdf" target="_blank">
              Material Sharing Policy
            </a>
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
            <a href="http://status.sparc.science/" target="_blank">
              SPARC Systems Status
            </a>
          </li>
          <li>
            <a :href="publicationsLink" target="_blank">
              SPARC Publications
            </a>
          </li>
          <li>
            <a href="https://sparc.science/help/3vcLloyvrvmnK3Nopddrka" target="_blank">
              SPARC Glossary
            </a>
          </li>
        </ul>
        <h3>Help Us Improve</h3>
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
        <h3>Stay Updated</h3>
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
    }),

    /**
     * Computed SPARC Publications link
     * @todo Dynamically build this url with available NIH awards
     * @returns {String}
     */
    publicationsLink: function() {
      return 'https://pubmed.ncbi.nlm.nih.gov/?term=(OD023873[gr])+OR+(OD023857[gr])+OR+(OD026580[gr])+OR+(OD025308[gr])+OR+(OD026545[gr])+OR+(TR002205[gr])+OR+(OD023854[gr])+OR+(OD025349[gr])+OR+(OD023848[gr])+OR+(OD025348[gr])+OR+(OD023850[gr])+OR+(NS113868[gr])+OR+(OD028183[gr])+OR+(OD023864[gr])+OR+(NS113873[gr])+OR+(OD028203[gr])+OR+(OD023872[gr])+OR+(OD023852[gr])+OR+(OD028191[gr])+OR+(OD024907[gr])+OR+(OD023847[gr])+OR+(DK116320[gr])+OR+(OD028201[gr])+OR+(OD026539[gr])+OR+(OD026577[gr])+OR+(OD023859[gr])+OR+(OD024899[gr])+OR+(OD025297[gr])+OR+(OD025307[gr])+OR+(TR002208[gr])+OR+(OD028190[gr])+OR+(OD024909[gr])+OR+(OD025306[gr])+OR+(DK116317[gr])+OR+(OD024898[gr])+OR+(OD023861[gr])+OR+(OD023871[gr])+OR+(DK116312[gr])+OR+(OD024912[gr])+OR+(OD025340[gr])+OR+(NS113869[gr])+OR+(OD026585[gr])+OR+(OD023860[gr])+OR+(OD025342[gr])+OR+(DK116311[gr])+OR+(OD026582[gr])+OR+(OD023867[gr])+OR+(OD023853[gr])+OR+(OD025347[gr])+OR+(OD024908[gr])+OR+(NS113871[gr])+OR+(NS113867[gr])+OR+(EB021716[gr])+OR+(EB021760[gr])+OR+(EB021780[gr])+OR+(EB021799[gr])+OR+(TR001925[gr])+OR+(18017[gr])+OR+(EB021787[gr])+OR+(EB021792[gr])+OR+(EB021759[gr])+OR+(EB021772[gr])+OR+(EB021793[gr])+OR+(TR001926[gr])+OR+(EB021790[gr])+OR+(TR001920[gr])+OR+(EB021877[gr])+OR+(OD023849[gr])+OR+(EB021789[gr])&sort='
    }
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
        display: inline-block;
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
          display: inline-block;
        }
      }
    }
  }
}
</style>
