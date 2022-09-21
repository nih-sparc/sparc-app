<template>
  <large-modal
    v-if="dialogVisible"
    :visible="dialogVisible"
    @close-download-dialog="dialogVisible = false"
  >
    <div class="content" slot="mainContent">
      <h1 class="heading1 mb-8">
        Sign Data Use Agreement
      </h1>
      <div class="agreement-body">
        <p class="body1">
          NIH SPARC EMBARGOED DATA USE AGREEMENT
        </p>
        <div class="align-left">
          <p class="body1">
            The SPARC Portal (“Portal”) is a data sharing resource funded by the National Institutes of Health (NIH) Stimulating Peripheral Activity to Relieve Conditions (SPARC) program. The Portal is used to disseminate data, maps, computational studies, protocols, tools, and other digital resources, in order to accelerate development of therapeutic devices that modulate electrical activity in peripheral nerves. This therapeutic strategy, also known as bioelectronic medicine, could offer new treatment options for diverse diseases and conditions such as hypertension, heart failure, gastrointestinal disorders, type II diabetes, inflammatory disorders, and more. Data are made publicly available on the Portal and can be used under the terms of the CC-BY license (unless otherwise specified). The Portal contains data from a variety of researchers, including SPARC-funded researchers (“SPARC Data Generators”). The Portal also provides a mechanism to request and access data from SPARC Data Generators that is scheduled to become publicly available in the future (“Embargoed Data”), per the public release timeline defined in the SPARC Material Sharing Policy. All data on the Portal is assigned a contact person (“Corresponding Contributor”) from which access can be requested.
          </p>
          <p class="body1">
            This NIH SPARC Embargoed Data Use Agreement (“Agreement”) describes the terms and conditions for use of Embargoed Data if access is approved by a Corresponding Author. For purposes of this Agreement, Embargoed Data means all information furnished by SPARC Data Generators and their unfunded project collaborators that is accessible through the Portal, but not yet publicly available, including without limitation, unpublished plans, methods, software, data, results, and findings by SPARC Data Generators.
          </p>
          <p class="body1">
            After accepting the terms and conditions outlined below by executing this Agreement, individuals and organizations seeking access to data (“Data Users”) may request access to Embargoed Data residing in the Portal. Approval of a request to access Embargoed Data is at the sole discretion of the Corresponding Author.
          </p>
          <p class="body1">
            Data User agrees to:
          </p>
          <p class="body1">
            Not use Embargoed Data for any purpose other than for the research project described in the data access request.
          </p>
          <p class="body1">
            Not disclose or distribute Embargoed Data to parties external to the SPARC Data Generator, even if said parties are employees of the same institution or entity as the SPARC Data Generator or Data User.
          </p>
          <p class="body1">
            Not use Embargoed Data for any commercial purposes without first executing a license with the owner of the data.
          </p>
          <p class="body1">
            Use the same level of care in safeguarding Embargoed Data that is used with his/her/their own confidential information of a similar nature, but in no event less than reasonable care.
          </p>
          <p class="body1">
            Use the data in accordance with all applicable laws, rules and regulations, and policies.
          </p>
          <p class="body1">
            Promptly report to the Corresponding Author any use or disclosure of the data not provided for by this Agreement of which it becomes aware; emails should CC info@sparc.science and use the specific subject line “Potential Data Breach Notification”.
          </p>
          <p class="body1">
            Data User’s obligations of confidentiality and limited use under this Agreement do not extend to any information that:
          </p>
          <p class="body1">
            is or becomes publicly available, except through breach of this Agreement.
          </p>
          <p class="body1">
            Data User can demonstrate that he/she/they possessed prior to, or developed independently from, disclosure or development under this Agreement, and was not acquired directly or indirectly from the SPARC Data Generator.
          </p>
          <p class="body1">
            becomes available to Data User from third party (external to the SPARC Data Generator) that, to the knowledge of Data User, is not legally prohibited from disclosing Embargoed Data.
          </p>
          <p class="body1">
            Data User is required by law, regulation or court order to disclose, provided that the Corresponding Author is promptly notified of any such requirement to allow such owning Data User to seek a protective order or other modifications to the requirement.
          </p>
          <p class="body1">
            NIH MAKES NO REPRESENTATIONS AND EXTENDS NO WARRANTIES OF ANY KIND, EITHER EXPRESSED OR IMPLIED. THERE ARE NO EXPRESSED OR IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, OR THAT THE USE OF THE DATA WILL NOT INFRINGE ANY PATENT, COPYRIGHT, TRADEMARK, OR OTHER PROPRIETARY RIGHTS.
          </p>
          <p class="body1">
            Unless prohibited by law, Data User assumes all liability for claims for damages against him/her/them by third parties which may arise from his/her/their use of the data.
          </p>
          <p class="body1">
            Data User will accept the terms of this Agreement via electronic click.
          </p>
        </div>
      </div>
      <div class="align-left mt-16">
        <sparc-checkbox
          v-model="checkboxVal"
          :label=true
          display="I agree to the terms and conditions of this data use agreement."
        />
      </div>
      <div class="close-button-container pt-16">
        <el-button class="secondary" @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button :disabled="!hasAcceptedAgreement" @click="submit">
          Sign and Submit
        </el-button>
      </div>
    </div>
  </large-modal>
</template>
<script>

export default {
  name: 'DataUseAgreementPopup',
  data() {
    return {
      dialogVisible: false,
      checkboxVal: false
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showDialog: {
      handler: function(show) {
        if (show) {
          this.dialogVisible = true
        }
      }
    },
    dialogVisible: {
      handler: function(show) {
        if (!show) {
          this.$emit('dialog-closed')
        }
      }
    }
  },
  computed: {
    hasAcceptedAgreement() {
      return this.checkboxVal
    }
  },
  methods: {
    submit: async function(x) {
      x.preventDefault()
      this.dialogVisible = false
      this.$emit('agreement-signed', true)
    },
  }
}
</script>
<style scoped lang="scss">
.close-button-container {
  text-align: right;
}
.agreement-body {
  overflow: auto;
  max-height: 20rem;
}
.align-left {
  text-align: left;
}
</style>
