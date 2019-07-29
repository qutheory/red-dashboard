<template>
  <div class="vr-signup">
    <div class="container">
      <div class="box">
        <div class="wrapper">
          <img class="logo" src="../assets/vapor-red-logo.png">
          <vr-form ref="form" @action="signup">
            <vr-form-input 
              placeholder="Vapor" 
              name="firstName" 
              required 
              v-model="firstName"
              title="First Name"
            ></vr-form-input>
            <vr-form-input 
              placeholder="User" 
              name="lastName" 
              required 
              v-model="lastName"
              title="Last Name"
            ></vr-form-input>
            <vr-form-input 
              title="Email" 
              type="email" 
              required 
              placeholder="user@vapor.red"
              v-model="email"
            ></vr-form-input>
            <vr-form-input 
              title="Password" 
              type="password"  
              required 
              v-model="password"
            ></vr-form-input>
            <!-- <h2>Choose a plan</h2>
            <div class="plans">
              <span>Vapor Red is free during this pre-release period.</span>
            </div> -->
            <div class="buttons">
              <div class="recover">
                <span>By signing up, you agree to our <router-link :to="{ name: 'recover' }">Terms of Service</router-link></span>
              </div>
              <div class="signup">
                <vr-button @action="$refs.form.submit()">Signup</vr-button>
              </div>
            </div>
          </vr-form>
        </div>
        <hr>
        <div class="wrapper">
          <span class="redirect">Already have an account? <router-link :to="{ name: 'login' }">Login</router-link> instead.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vr-signup',
  props: { },
  methods: {
    async signup () {
      this.$notify.loading.start()
      try {
        await this.$api.signup({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email, 
          password: this.password,
        })
        this.$notify.push({
          type: 'info',
          title: 'Account Created',
          message: 'We sent you an email to verify your account.'
        })
        this.$router.push({ name: 'login', query: { new: true } })
      } catch(error) {
        this.$notify.push({
          type: 'error',
          title: 'Could not signup',
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
      password: null,
      firstName: null,
      lastName: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-signup
  height: 100%
  width: 100%

  hr
    margin-top: 0

  .container
    height: 100%
    display: flex
    align-items: center
    justify-content: center

    .box
      background: $color-white
      padding-top: 16px
      padding-bottom: 16px
      box-shadow: $shadow-1

      @media only screen and (min-width: 321px)
        width: 480px
        border-radius: 8px

      .wrapper
        padding: 0 32px

      hr
        border-color: $color-light-gray

      .double
        display: flex
        .spacer
          width: 16px
        .vr-form-input
          flex-grow: 1

      h2
        margin: 0
        margin-top: 16px
        font-size: 18px
        font-weight: 700

      .plans
        width: 100%
        border: 2px solid $color-light-gray
        padding: 16px
        height: 64px
        margin-top: 16px
        border-radius: 8px
        display: flex
        justify-content: center
        align-items: center
        margin-bottom: 8px

        span
          text-align: center
          font-size: 14px
          font-style: italic
          color: $color-gray

      .logo
        height: 64px
        display: block
        margin: 0 auto
        margin-bottom: 24px
        margin-top: 16px

      .redirect
        display: block
        font-size: 14px
        text-align: center
        color: $color-dark-gray

      .buttons
        padding-top: 8px
        display: flex
        .recover
          flex-grow: 1
          padding-top: 12px
          span
            font-size: 14px
            line-height: 16px
</style>
