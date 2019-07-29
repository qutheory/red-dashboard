<template lang="pug">
  .vr-menu
    .logo
      img(src="../assets/vapor-red-logo.svg")
    .nav
      router-link(:to="{ name: 'servers.index' }") Servers
      router-link(:to="{ name: 'apps.index' }") Apps
      router-link(:to="{ name: 'billing.index' }") Billing
      router-link(:to="{ name: 'team.index' }") Team
      router-link(:to="{ name: 'providers.index' }") Providers
      router-link(:to="{ name: 'support' }") Support
    .feedback
      span.version {{ version }}
</template>

<script>
export default {
  name: 'vr-menu',
  props: ['user', 'company'],
  computed: {
    version() {
      return this.$version
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-menu
  padding-top: 16px
  height: 100%
  flex-wrap: wrap
  color: white
  align-items: top

  .vr-dark &
    background: $color-black
    border-right: 2px solid $color-dark-gray

  .version
    position: absolute
    bottom: 16px
    width: 100%
    font-size: 12px
    margin-bottom: 2px
    margin-left: 32px

    color: $color-gray
    .vr-dark &
      color: $color-dark-gray

  .logo
    width: 100%
    padding: 0 32px
    height: 48px
    img
      height: 100%

  .nav
    margin-top: 16px

    a
      width: 100%
      font-size: 18px
      display: block
      height: 40px
      color: $color-white
      padding: 0 32px
      line-height: 40px
      opacity: 1
      @media only screen and (min-width: 2048px)
        border-top-left-radius: 8px
        border-bottom-left-radius: 8px

      &:hover
        background: rgba($color-white, 0.1)

      &.router-link-active
        background: $color-white
        color: $color-black
        .vr-dark &
          color: $color-white
          background: $color-dark-gray

</style>

