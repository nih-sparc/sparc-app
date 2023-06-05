<template>
  <div>
    <el-form-item
      prop="typeOfUser"
      label="What type of user are you? *"
    >
      <el-select
        v-model="typeOfUser"
        v-on:change="$emit('type-of-user-updated', $event)"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="userType in userTypes"
          :key="userType"
          :label="userType"
          :value="userType"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="userFirstName" label="First Name *">
      <el-input v-model="userFirstName" placeholder="Enter your first name" v-on:input="$emit('first-name-updated', $event)" />
    </el-form-item>

    <el-form-item prop="userLastName" label="Last Name *">
      <el-input v-model="userLastName" placeholder="Enter your last name" v-on:input="$emit('last-name-updated', $event)" />
    </el-form-item>

    <el-form-item prop="userEmail" label="Email *" class="mb-0">
      <el-input v-model="userEmail" placeholder="Enter your email address" type="email" v-on:input="$emit('email-updated', $event)" />
    </el-form-item>

    <el-form-item v-if="showFollowUpOption" prop="shouldFollowUp" class="mt-16 mb-0">
      <el-checkbox v-model="shouldFollowUp" v-on:change="$emit('follow-up-updated', $event)">
        <span class="body1">Let me know when you resolve this issue</span>
      </el-checkbox>
    </el-form-item>

    <el-form-item prop="sendCopy" :class="['mb-0', { 'mt-16': !showFollowUpOption }]">
      <el-checkbox v-model="sendCopy" v-on:change="$emit('send-copy-updated', $event)">
        <span class="body1">Please send me a copy of this message</span>
      </el-checkbox>
    </el-form-item>

    <el-form-item prop="shouldSubscribe">
      <el-checkbox v-model="shouldSubscribe" v-on:change="$emit('subscribe-updated', $event)">
        <span class="body1">Subscribe to the SPARC Newsletter</span>
      </el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'UserContactFormItem',
  props: {
    showFollowUpOption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeOfUser: '',
      userFirstName: this.firstName,
      userLastName: this.lastName,
      userEmail: this.profileEmail,
      shouldFollowUp: true,
      sendCopy: true,
      shouldSubscribe: false,
    }
  },
  computed: {
    ...mapState('pages/contact-us', {
      userTypes: state => state.formOptions.userTypes,
    }),
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail']),
  },
  watch: {
    firstName: {
      handler: async function(name) {
        this.userFirstName = name
        this.$emit('first-name-updated', name)
      },
      immediate: true
    },
    lastName: {
      handler: async function(name) {
        this.userLastName = name
        this.$emit('last-name-updated', name)
      },
      immediate: true
    },
    profileEmail: {
      handler: async function(email) {
        this.userEmail = email
        this.$emit('email-updated', email)
      },
      immediate: true
    },
  }
}
</script>
