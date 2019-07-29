<template>
  <div class="vr-app-no-user">
      <transition name="appear-up">
        <router-view class="view" @login="$emit('login', $event)"></router-view>
      </transition>
      <div class="footer">
        <a href="https://vapor.red">vapor.red</a>
        <a href="https://docs.vapor.red">Documentation</a>
      </div>
  </div>
</template>

<script>
export default {
  name: 'vr-app-no-user'
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-app-no-user
  height: 100%
  position: relative
  z-index: 500

  .view
    position: absolute
    z-index: 700
    top: 0
    left: 0
    right: 0
    bottom: 0
    padding-bottom: 48px

  .footer
    position: absolute
    bottom: 0
    width: 100%
    height: 48px
    padding: 8px 16px
    display: flex
    a
      padding: 8px
      line-height: 16px
      font-size: 14px
      color: $color-white
      text-decoration: none
</style>
