<template lang="pug">
  .vr-recover
    .container
      .box
        h2 Change Password
        p Choose a new password.
        vr-form(ref="form" @action="submit")
          vr-form-input(
            title="New Password" 
            type="password" 
            required 
            v-model="password"
            autocomplete="new-password"
          )
          vr-button(@action="$refs.form.submit()") Submit
</template>

<script>
export default {
  name: 'vr-recover',
  props: { },
  methods: {
    async submit () {
      this.$notify.loading.start()
      try {
        await this.$api.resetPassword.complete({
          password: this.password,
          password2: this.password,
          token: this.token
        })
        this.$notify.info('Password updated', 'You may now login')
        this.password = null
        this.$router.push({ name: 'login' })
      } catch (error) {
        this.$notify.error('Could not update password', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  computed: {
    token() {
      return this.$route.query.token
    }
  },
  mounted() { },
  data () {
    return {
      password: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-recover  
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
    padding: 32px
    padding-bottom: 16px
    margin-bottom: 16px
</style>
