<template lang="pug">
  div(class="vr-login")
    div(class="login-box-container")
      div(class="login-box")
        div(class="login-box-wrapper")
          img(class="logo" src="../assets/vapor-red-logo.png")
          vr-form(ref="form" @action="login")
            vr-form-input(
              title="Email" 
              type="email" 
              required 
              v-model="email"
            )
            vr-form-input(
              title="Password" 
              type="password"  
              required 
              v-model="password"
            )
            div(class="login-buttons")
              div(class="recover")
                router-link(:to="{ name: 'reset-password' }") Reset Password
              div(class="login")
                vr-button(@action="$refs.form.submit()") Login
        hr
        div(class="login-box-wrapper")
          span(class="signup") Don't have an account? #[router-link(:to="{ name: 'signup' }") Sign up] for free.
</template>

<script>
export default {
  name: 'vr-login',
  props: {
    msg: String
  },
  methods: {
    async login () {
      this.$notify.loading.start()
      try {
        var session = await this.$api.login({ email: this.email, password: this.password })
        this.$emit('login', session)
        if (this.$route.query.new) {
          this.$router.push({ name: 'billing.plan' })
        } else {
          this.$router.push({ name: 'servers.index' })
        }
      } catch(error) {
        this.$notify.push({
          type: 'error',
          title: 'Could not login',
          message: error.message
        })
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  mounted() {
    this.show = true
  },
  data () {
    return {
      email: null,
      password: null
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-login
  height: 100%
  width: 100%

  .login-box-container
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    .login-box
      padding-top: 16px
      padding-bottom: 16px
      background: $color-white
      width: 100%

      @media only screen and (min-width: 321px)
        width: 320px
        border-radius: 8px
        box-shadow: $shadow-1

      .login-box-wrapper
        padding: 0 32px

      hr
        border-color: $color-light-gray
      .logo
        height: 64px
        display: block
        margin: 0 auto
        margin-bottom: 24px
        margin-top: 16px
      .signup
        font-size: 14px
        text-align: center
        color: $color-dark-gray
      .login-buttons
        display: flex
        align-items: center
        .recover, .login
          width: 50%
        .recover
          a
            font-size: 14px
            line-height: 16px
        .login
          text-align: right
          .vr-button
            margin-bottom: 0
</style>
