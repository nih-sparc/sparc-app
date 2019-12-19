<template>
  <div class="section footer">
    <el-row type="flex" justify="center">
      <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
        <div class="footer-content">
          <el-row>
            <el-col class="contact" :md="4">
              <sparc-logo class="logo"></sparc-logo>
            </el-col>
            <el-col class="contact" :md="5">
              <h4>Contact</h4>
              <a href="mailto:info@sparc.science">
                <p>info@sparc.science</p>
              </a>
              <a href="#" @click.prevent="isContactModalVisible = true">Contact Us</a>
            </el-col>
            <el-col class="contact" :md="5">
              <h4>learn More</h4>
              <a href="https://sparc.science">
                <p>SPARC Portal</p>
              </a>
              <a href="https://commonfund.nih.gov/Sparc/">
                <p>SPARC NIH</p>
              </a>
              <a href="https://twitter.com/sparc_science">
                <p>Twitter</p>
              </a>
              <a href="https://www.youtube.com/results?search_query=sparc+nih">
                <p>Youtube</p>
              </a>
              <a href="https://www.sparc-science.org/Privacy_policy/">
                <p>Privacy Policy</p>
              </a>
            </el-col>
            <el-col class="contact" :md="5">
              <h4>Help Us Improve</h4>
              <a href="https://www.sparc-science.org/feedback/">Website feedback</a>
            </el-col>
            <el-col class="contact" :md="5">
              <h4>Stay Up-To-Date: Subscribe</h4>
              <a
                href="https://list.nih.gov/cgi-bin/wa.exe?SUBED1=NIH-SPARC-INFO&A=1"
              >SPARC mailing list</a>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <contact-us-modal :visible.sync="isContactModalVisible" />
  </div>
</template>

<script>
import SparcLogo from "@/components/logo/SparcLogo.vue"
import ContactUsModal from "@/components/footer/ContactUsModal"

const footerAddress = {
  name: "National Institutes of Health",
  street: "990 Rockville Pike",
  city: "Bethesda",
  state: "Maryland"
}

const footerEmailAddress = "gene.civillico@nih.gov"

const footerPhoneNumber = ["301", "451", "3180"]

const footerTwitterHandle = "/"

const footerFacebookHandle = "/"

const footerLinks = [
  {
    title: "Overview",
    items: [
      {
        title: "Program components",
        href: "/"
      },
      {
        title: "SPARC OTs",
        href: "/"
      },
      {
        title: "Working group",
        href: "/"
      }
    ]
  },
  {
    title: "Research",
    items: [
      {
        title: "Funded research",
        href: "/"
      },
      {
        title: "Translational partnerships",
        href: "/"
      },
      {
        title: "Opportunities",
        href: "/"
      },
      {
        title: "Devices",
        href: "/"
      },
      {
        title: "Publications",
        href: "/"
      }
    ]
  },
  {
    title: "Resources",
    items: [
      {
        title: "Cores",
        href: "/"
      },
      {
        title: "Templates and references",
        href: "/"
      },
      {
        title: "Materials",
        href: "/"
      }
    ]
  },
  {
    title: "News",
    items: [
      {
        title: "Events",
        href: "/"
      },
      {
        title: "Announcements",
        href: "/"
      }
    ]
  },
  {
    title: "Support",
    items: [
      {
        title: "Documentation",
        href: "/"
      },
      {
        title: "Tutorials",
        href: "/"
      },
      {
        title: "Feedback",
        href: "/"
      }
    ]
  }
]

export default {
  name: "sparc-footer",
  components: {
    SparcLogo,
    ContactUsModal
  },
  data: () => ({
    footerLinks,
    footerAddress,
    footerPhoneNumber,
    footerEmailAddress,
    footerTwitterHandle,
    footerFacebookHandle,
    isContactModalVisible: false
  })
};
</script>

<style scoped lang="scss">
@import "@/assets/_variables.scss";

.footer-content {
  size: 10pt;
}

.footer {
  padding: 6em 0;
  background: #edf1fc;

  color: #5d6478;
  text-transform: uppercase;

  .link-header {
    color: #000;
  }

  .footer-content {
    .contact {
      margin-bottom: 2em;

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
      height: 74px;
      width: 120px;
      margin-bottom: 3em;
      margin-top: -9px;
    }
  }
}

.link-sections {
  display: flex;
  flex-wrap: wrap;
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
