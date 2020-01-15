<template>
  <div class="section footer">
    <el-row type="flex" justify="center">
      <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
        <div class="footer-content">
          <el-row>
            <el-col class="contact" :md="9">
              <sparc-logo class="logo" />
              <p>
                The Common Fund’s Stimulating Peripheral Activity to Relieve
                Conditions (SPARC) program seeks to accelerate development of
                therapeutic devices that modulate electrical activity in nerves
                to improve organ function.
              </p>
            </el-col>
            <el-col class="contact" :md="4">
              <h4>Contact</h4>
              <a href="https://commonfund.nih.gov/Sparc/">
                <p>SPARC NIH</p>
              </a>
              <a href="#" @click.prevent="isContactModalVisible = true">
                Contact SPARC
              </a>
              <a
                href="https://list.nih.gov/cgi-bin/wa.exe?SUBED1=NIH-SPARC-INFO&A=1"
              >
                <p>Subscribe</p>
              </a>
            </el-col>
            <el-col class="contact" :md="4">
              <h4>Connect</h4>
              <a href="https://twitter.com/sparc_science">
                <p>Twitter</p>
              </a>
              <a href="https://www.youtube.com/results?search_query=sparc+nih">
                <p>Youtube</p>
              </a>
            </el-col>
            <el-col class="contact" :md="5">
              <h4>Help Us Improve</h4>
              <a href="https://www.sparc-science.org/feedback/">
                <p>Send Us Feedback</p>
              </a>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="copyright">
                <p>
                  Copyright © 2019. SPARC Data Resource Center. All Rights
                  Reserved.
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <contact-us-modal :visible.sync="isContactModalVisible" />
  </div>
</template>

<script>
import SparcLogo from '@/components/logo/SparcLogo.vue'
import ContactUsModal from '@/components/footer/ContactUsModal'

export default {
  name: 'SparcFooter',
  components: {
    SparcLogo,
    ContactUsModal
  },
  data: () => ({
    isContactModalVisible: false
  })
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';

.footer-content {
  size: 10pt;
}

.footer {
  padding-top: 4em;
  padding-bottom: 1em;
  background: #edf1fc;

  color: #5d6478;
  text-transform: uppercase;

  .link-header {
    color: #000;
  }

  .footer-content {
    .contact {
      padding-right: 32px;
      //   margin-bottom: 2em;

      a {
        color: #5d6478;
        font-weight: lighter;
        font-size: 15px;
        text-decoration: none;
        text-transform: none;
        &:hover {
          text-decoration: none;
          font-size: 15px;
          color: #5d6478;
        }
      }

      p {
        font-weight: lighter;
        text-transform: none;
        font-size: 15px;
        margin: 0;
      }

      h4 {
        margin-top: 0;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 15px;
        color: #5d6478;
      }
    }

    .logo {
      height: 50px;
      width: 120px;
      margin-top: -9px;
    }
  }
}

.link-sections {
  display: flex;
  flex-wrap: wrap;
}

.copyright {
  margin-top: 80px;
  // margin-left: 32px;
  p {
    font-weight: lighter;
    text-transform: none;
    font-size: 15px;
    margin: 0;
  }
}

.link-section {
  padding-bottom: 3em;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.5em 0;
      margin: 0;

      a {
        color: #606266;
        text-decoration: none;

        &:hover {
          color: #909399;
        }
      }
    }
  }
}
</style>
