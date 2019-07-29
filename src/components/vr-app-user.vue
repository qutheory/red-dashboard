<template lang="pug">
.vr-app-user(:class="{ 'menu-open': menuOpen }")
  .wrapper
    .menu
      vr-menu(:user='user', :company="company")
    .content
      .header
        vr-header(
          @menu-toggle='menuToggle'
          :user='user'
          :company='company'
          @logout="$emit('logout', $event)"
          @switch-company="$emit('switch-company', $event)"
          @switch-theme="$emit('switch-theme', $event)"
          :darkMode='darkMode'
        )
      .container
        transition(name='slide-up')
          router-view.view(
            :company='company'
            :user='user'
          )
</template>

<script>
export default {
  name: 'vr-app-user',
  props: ['user', 'company', 'darkMode'],
  methods: {
    menuToggle() {
      this.menuOpen = !this.menuOpen
    }
  },
  async mounted () { },
  data () {
    return {
      menuOpen: false
    }
  },
  watch: {
    '$route' () {
      if (this.menuOpen) {
        this.menuOpen = false
      }
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-app-user
  @media only screen and (min-width: 2048px)
    padding-top: 32px
  .wrapper
    position: relative
    width: 100%
    height: 100%
    @media only screen and (min-width: 2048px)
      width: 2048px
      margin: 0 auto
  .menu
    height: 100%
    flex-grow: 1
    position: absolute
    left: 0
    width: 192px
    left: -192px
    transition: left $animation-duration $animation-ease

    @media only screen and (min-width: 700px)
      left: 0px

  .content
    height: 100%
    left: 0
    right: 0
    position: absolute
    transition: left $animation-duration $animation-ease, right $animation-duration $animation-ease
    padding-top: 80px
    -webkit-overflow-scrolling: touch

    background: $color-white
    color: $color-black
    .vr-dark &
      background: $color-black
      color: $color-white

    @media only screen and (min-width: 700px)
      left: 192px

    @media only screen and (min-width: 2048px)
      border-radius: 8px

    .header
      width: 100%
      position: absolute
      top: 0
      left: 0
      right: 0

    .container
      width: 100%
      height: 100%
      position: relative

      .view
        padding: 0 16px
        @media only screen and (min-width: 700px)
          padding: 0 32px
        padding-bottom: 32px
        position: absolute
        overflow: auto
        top: 0
        left: 0
        right: 0
        bottom: 0

  &.menu-open
    .menu
      left: 0
    .content
      left: 192px
      right: -192px
</style>
