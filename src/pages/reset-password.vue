<template lang="pug">
  .vr-reset-password
    .container
      .box
        .wrapper
          h2 Reset Password
          p Enter your email and we'll send you a link to reset your password.
          vr-form(ref="form" @action="submit")
            vr-form-input(
              title="Email" 
              type="email" 
              required 
              v-model="email"
              autocomplete="username"
            )
            vr-button(@action="$refs.form.submit()") Submit
        hr
        .wrapper
          span Remembered your password? #[router-link(:to="{ name: 'login' }") Login]
</template>

<script>
export default {
  name: 'vr-reset-password',
  props: { },
  methods: {
    async submit () {
      this.$notify.loading.start()
      try {
        await this.$api.resetPassword.request({
          email: this.email
        })
        this.$notify.info('Password reset requested', 'Check your email for a password reset link')
        this.$router.push({ name: 'login' })
        this.email = null
      } catch (error) {
        this.$notify.error('Could not request password reset', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  mounted() { },
  data () {
    return {
      email: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-reset-password  
  .container
    height: 100%
    display: flex
    align-items: center
    justify-content: center
  .vr-form
    margin-top: 24px
  .box
    width: 320px
    background: $color-white
    border: 2px solid $color-light-gray
    border-radius: 8px
    padding-bottom: 16px
    margin-bottom: 16px
    padding-top: 16px
    .wrapper
      padding: 0 32px
    hr
      margin-top: 0
    span
      width: 100%
      display: block
      font-size: 14px
      text-align: center
      color: $color-dark-gray
</style>
