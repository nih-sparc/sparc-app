<template>
  <div>

    <div
      v-if="this.askingForEmail"
      class="login-wrap"
    >
      <h2 class="sharp-sans">
        Welcome to the SPARC Portal!
      </h2>
      <p>Please enter your email address so that we may add it to your user profile. Having an email address associated with your user profile is important. The Pennsieve platform sends emails to users from time to time.</p>
      <el-form
        id="email-form"
        ref="emailForm"
        :model="emailForm"
        :rules="emailRules"
        status-icon
        @submit.native.prevent="onSubmitLookupEmailAddress"
      >
        <el-form-item
          label="Email Address"
          prop="emailAddress"
        >
          <el-input
            v-model="emailForm.emailAddress"
            required
            class="email-address-input"
            autofocus
          />
        </el-form-item>
        <el-form-item>
          <bf-button
            class="saveProfile"
            :processing="isSavingProfile"
            processing-text="Looking up email address"
            @click="onSubmitLookupEmailAddress"
          >
            Add Email Address
          </bf-button>
        </el-form-item>
      </el-form>
    </div>

    <div
      v-if="this.askingForProfileInfo"
      class="login-wrap"
      >
      <h2 class="sharp-sans">
        Let's set up your profile.
      </h2>
      <p>Welcome to the Pennsieve platform! Complete your profile so members of your team can easily identify you. <strong>All fields are required</strong>.</p>
      <el-form
        id="profile-form"
        ref="profileForm"
        :model="profileForm"
        :rules="profileRules"
        status-icon
        @submit.native.prevent="onSubmitUpdateProfile"
      >
        <el-form-item
          label="First Name"
          prop="firstName"
        >
          <el-input
            v-model="profileForm.firstName"
            required
            class="first-name-input"
            autofocus
          />
        </el-form-item>
        <el-form-item
          label="Last Name"
          prop="lastName"
        >
          <el-input
            v-model="profileForm.lastName"
            required
          />
        </el-form-item>
        <el-form-item>
          <bf-button
            class="saveProfile"
            :processing="isSavingProfile"
            processing-text="Saving profile"
            @click="onSubmitUpdateProfile"
          >
            Save Profile
          </bf-button>
        </el-form-item>
      </el-form>
      <p class="agreement">
        By clicking “Save Profile” you are agreeing to the Pennsieve
        <a
          href="https://docs.pennsieve.io/page/pennsieve-terms-of-use"
          target="_blank"
        >
          Terms of Use
        </a> and
        <a
          href="https://docs.pennsieve.io/page/privacy-policy"
          target="_blank"
        >
          Privacy Policy
        </a>.
      </p>
    </div>

    <div
      v-if="this.askingForPassword"
      class="login-wrap"
      >
      <h2 class="sharp-sans">
        We found an existing account
      </h2>
      <p>A Pennsieve account exists with the email address <strong>{{emailForm.emailAddress}}</strong>. Connecting your accounts will allow you to sign-in with your email address or ORCID iD.</p>
      <p>Please enter the password for the Pennsieve account associated with your email address.</p>
      <el-form
        id="password-form"
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        status-icon
        @submit.native.prevent="onSubmitAuthenticate"
      >
        <el-form-item
          label="Email Address"
          prop="emailAddress"
        >
          <el-input
            v-model="passwordForm.emailAddress"
            required
            class="email-address-input"
            readonly
          />
        </el-form-item>
        <el-form-item
          label="Password"
          prop="password"
          class="password-valid"
        >
          <el-input
            v-model="passwordForm.password"
            type="password"
            @enter="onSubmitAuthenticate"
          />
        </el-form-item>
        <el-form-item>
          <bf-button
            class="saveProfile"
            :processing="isSavingProfile"
            processing-text="Merging accounts"
            @click="onSubmitAuthenticate"
          >
            Authenticate Pennsieve email account
          </bf-button>
          <bf-button
            class="saveProfile"
            :processing="isSavingProfile"
            processing-text="Merging accounts"
            @click="onClickEnterDifferentEmailAddress"
          >
            Enter a Different Email Address
          </bf-button>
        </el-form-item>
      </el-form>
    </div>

    <div
      v-if="this.askingToConnect"
      class="login-wrap"
      >
      <h2 class="sharp-sans">
        Authentication successful
      </h2>
      <p>Your Pennsieve email account has been authenticated. Now let's connect your Pennsieve and ORCID accounts.</p>
      <bf-button
        class="completeLogin"
        :processing="isSavingProfile"
        processing-text="Connecting Accounts"
        @click="onClickConnectAccounts"
      >
        Connect Accounts
      </bf-button>
    </div>


    <div
      v-if="this.allDone"
      class="login-wrap"
      >
      <h2 class="sharp-sans">
        Account setup and integration is complete!
      </h2>
      <p>Your account setup and ORCID iD integration is complete. Click <strong>Home</strong> to start working with the SPARC Platform.</p>
      <bf-button
        class="completeLogin"
        :processing="isSavingProfile"
        processing-text="Processing..."
        @click="onClickHome"
      >
        Home
      </bf-button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BfButton from '@/components/shared/BfButton/BfButton.vue'
import {pathOr} from "ramda";
import Request from '@/mixins/request'
import { Auth } from '@aws-amplify/auth'
import EventBus from "@/static/js/event-bus";
export default {
  name: 'SetupNewUser',
  components: {
    BfButton
  },
  mixins: [Request],
  data() {
    return {
      internalState: 0,
      internalStates: {
        initial: 0,
        askingForEmail: 0,
        askingForProfileInfo: 1,
        askingForPassword: 2,
        askingToConnect: 3,
        done: 4
      },
      emailForm: {
        emailAddress: ''
      },
      emailRules: {
        emailAddress: [
          {required: true, message: 'Please enter your email address', trigger: 'submit'}
        ]
      },
      profileForm: {
        firstName: '',
        middleInitial: '',
        lastName: '',
        credential: '',
        degree: null
      },
      profileRules: {
        firstName: [
          { required: true, message: 'Please enter your first name', trigger: 'submit' }
        ],
        lastName: [
          { required: true, message: 'Please enter your last name', trigger: 'submit' }
        ]
      },
      passwordForm: {
        emailAddress: '',
        password: ''
      },
      passwordRules: {
        emailAddress: [
          { required: true, message: 'Please add your Email', trigger: 'submit' }
        ],
        password: [
          { required: true, message: 'Please add your Password', trigger: 'submit' }
        ]
      },
      isSavingProfile: false,
      isPasswordFormValid: false,
      isUserSignInFailed: false,
      currentAuthentication: {
        user: '',
        token: '',
        userAttributes: ''
      },
      authenticatedUser: {
        emailAddress: '',
        token: ''
      },
      oauthWindow: '',
      oauthCode: '',
      oauthInfo: ''
    }
  },
  computed: {
    ...mapGetters('user', ['cognitoUserToken', 'cognitoUserAttributes', 'cognitoUsername', 'pennsieveUserIntId', 'profileColor', 'profileUrl', 'profilePreferredOrganization']),

    askingForEmail: function() {
      return this.internalState == this.internalStates.askingForEmail
    },
    askingForProfileInfo: function() {
      return this.internalState == this.internalStates.askingForProfileInfo
    },
    askingForPassword: function() {
      return this.internalState == this.internalStates.askingForPassword
    },
    askingToConnect: function() {
      return this.internalState == this.internalStates.askingToConnect
    },
    allDone: function() {
      return this.internalState == this.internalStates.done
    },
    apiUrl: function() {
      return process.env.USER_ACTIONS_API_URL
    },
    getUserByEmailRequest: function() {
      return `${this.apiUrl}/user/email/`
    },
    updateUserEmailUrl: function() {
      return `${this.apiUrl}/user/email`
    },
    updateUserProfileUrl: function() {
      return `${this.apiUrl}/user`
    },
    updateUserCustomTermsOfService: function() {
      return `${this.apiUrl}/custom-terms-of-service`
    },
    updateUserPennsieveTermsOfService: function() {
      return `${this.apiUrl}/pennsieve-terms-of-service`
    },
    mergeUserAccountsUrl: function() {
      return `${this.apiUrl}/user/merge`
    },
  },
  mounted () {
    this.currentAuthentication.user = this.cognitoUser
    this.currentAuthentication.token = this.cognitoUserToken
    this.currentAuthentication.userAttributes = this.cognitoUserAttributes
  },
  methods: {
    clearEmailForm: function() {
      this.emailForm.emailAddress = ''
    },
    clearProfileForm: function() {
      this.profileForm.firstName = ''
      this.profileForm.lastName = ''
    },
    clearPasswordForm: function() {
      this.authenticatedUser = {
        emailAddress: '',
        token: ''
      }
      this.passwordForm.emailAddress = ''
      this.passwordForm.password = ''
    },
    clearAllForms: function() {
      this.clearEmailForm()
      this.clearProfileForm()
      this.clearPasswordForm()
    },
    toAskForEmailAddress: function() {
      this.clearEmailForm()
      this.internalState = this.internalStates.askingForEmail
    },
    toAskForProfileInfo: function() {
      this.clearProfileForm()
      this.internalState = this.internalStates.askingForProfileInfo
    },
    toAskForPassword: function() {
      this.clearPasswordForm()
      this.passwordForm.emailAddress = this.emailForm.emailAddress
      this.internalState = this.internalStates.askingForPassword
    },
    toAskToConnectAccounts: function() {
      this.internalState = this.internalStates.askingToConnect
    },
    toAllDone: function() {
      this.internalState = this.internalStates.done
    },
    startOver: function() {
      this.clearAllForms()
      this.toAskForEmailAddress()
    },
    onSubmitLookupEmailAddress: function() {
      // TODO: validate form
      this.lookupEmailAddress(this.emailForm.emailAddress)
    },
    lookupEmailAddress: function(email) {
      const url = `${this.getUserByEmailRequest}${email}`
      this.sendXhr(url, {
        method: 'GET',
        header: {
          'Authorization': `bearer ${this.cognitoUserToken}`
        }
      })
        .then(user => {
          // email exists, next ask for password
          this.toAskForPassword()
        })
        .catch(error => {
          if (error.status === 404) {
            // email address does not exist, update the user's email address
            this.toAskForProfileInfo()
          } else {
            this.logUserError("lookupEmailAddress()", "Error looking up email address", error)
            this.startOver()
          }
        })
    },
    onSubmitUpdateProfile: function() {
      // TODO: validate form
      this.updateUserProfile(this.profileForm)
    },
    updateUserProfile: function(profileForm) {
      // Must update the email address before updating the profile. This is all done in the same step to 
      // prevent the user from refreshing the page after updating the email address but before updating the profile info
      const url = `${this.updateUserEmailUrl}`
      const headers = { 'Authorization': `bearer ${this.cognitoUserToken}` }
      this.$axios.$put(url, { email: this.emailForm.emailAddress }, { headers }).then(() => {
        const url = this.updateUserProfileUrl
        const headers = { 'Authorization': `bearer ${this.cognitoUserToken}` }
        const body = {
          organization: this.profilePreferredOrganization,
          email: this.emailForm.email,
          url: this.profileUrl,
          color: this.profileColor,
          ...profileForm
        }
        this.$axios.$put(url, body, { headers }).then(() => {
          // TODO: make user accept SPARC Terms of Service and set it checked on the profile
          this.toAllDone()
        })
        .catch(error => {
          this.logUserError("updateUserProfile()", "Error updating user profile", error)
          this.toAskForProfileInfo()
        })
      })
      .catch(error => {
        this.logUserError("updateUserEmailAddress()", "Error updating email address", error)
        this.toAskForEmailAddress()
      })
    },
    onSubmitAuthenticate: function() {
      this.authenticatedUser.emailAddress = this.passwordForm.emailAddress
      Auth.signIn(this.passwordForm.emailAddress, this.passwordForm.password)
        .then(authenticatedUser => {
          this.authenticatedUser.token = pathOr('', ['signInUserSession', 'accessToken', 'jwtToken'], authenticatedUser)
          this.toAskToConnectAccounts()
        })
        .catch(error => {
          this.logUserError("onSubmitAuthenticate()", "Error authenticating user", error)
          this.toAskForPassword()
        })
    },
    onClickConnectAccounts: async function() {
      const url = `${this.mergeUserAccountsUrl}/${this.pennsieveUserIntId}`
      const headers = { 'Authorization': `bearer ${this.authenticatedUser.token}` }
      // include password in order to pass it on to new Cognito user so that a new one doesn't need to be requested
      const body = {
        email: this.authenticatedUser.emailAddress,
        cognitoId: this.cognitoUsername,
        password: this.passwordForm.password
      }
      await this.$axios.$put(url, body, { headers }).then(async () => {
        await this.$store.dispatch('user/logout')
        this.toAllDone()
      })
      .catch(error => {
        this.logUserError("onClickConnectAccounts()", "Error connecting accounts", error)
        this.toAskForPassword()
      })
    },
    onClickEnterDifferentEmailAddress: function() {
      this.toAskForEmailAddress()
    },
    onClickHome: async function() {
      await this.$store.dispatch('user/fetchUser')
      this.$router.push('/')
    },
    logUserError: function(fn, message, error) {
      console.log(`${fn} [${message}] error: ${error}`)
      this.toast(message)
    },
    toast: function(message) {
      const notification = {
        message: message,
        showClose: true,
        iconClass: 'el-icon-circle-close',
        customClass: 'el-message--error',
        duration: 5000
      }
      this.$notify(notification)
    }
  }
}
</script>

<style scoped lang="scss">

</style>