<template lang="pug">
  .vr-verify
</template>


<script>
export default {
  name: 'vr-verify',
  props: { },
  async mounted() {
    this.token = this.$route.query.token
    this.email = this.$route.query.email
    this.$notify.loading.start()
      try {
        await this.$api.verifyAccount({
          token: this.token,
          email: this.email
        })
      } catch(error) {
        this.$notify.push({
          type: 'error',
          title: 'Could not verify',
          message: 'Your account could not be verified'
        })
      } finally {
        this.$notify.loading.stop()
      }
      this.$router.push({ name: 'login', query: { new: true } })
  },
  data () {
    return {
      token: null,
      email: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-verify
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
